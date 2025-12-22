import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Account } from '../../account';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CommonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  submitted: boolean = false;

  form!: FormGroup; 
  loading: boolean = false;     // ✅ FIXED
  serverError: string = "";
  fieldErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private account: Account   // ✅ FIXED (Service Injected)
  ) {

    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // -----------------------------
  // Helper for clean control access
  // -----------------------------
  get(field: string) {
    return this.form.get(field);
  }

  register() {

      
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.get('password')!.value !== this.get('confirmPassword')!.value) {
      this.serverError = 'Passwords do not match';
      return;
    }

    this.serverError = '';
    this.fieldErrors = {};
    this.loading = true;

    const payload = {
      firstName: this.get('firstName')!.value,
      lastName: this.get('lastName')!.value,
      email: this.get('email')!.value,
      password: this.get('password')!.value
    };

    this.account.register(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {

          if (res?.status === 'EmailExists') {
            this.serverError = 'An account with this email already exists.';
            this.fieldErrors['email'] = 'Email already exists';
            return;
          }

          if (res?.status === 'VerificationEmailSent') {
            this.router.navigate(['/verify-email-info'], {
              queryParams: { email: payload.email }
            });
            return;
          }

          this.router.navigate(['/verify-email-info'], {
            queryParams: { email: payload.email }
          });
        },

        error: (err: any) => {
          this.processErrors(err);
        }
      });
  }



  processErrors(err: any) {
    if (!err || !err.error) {
      this.serverError = 'Unexpected error occurred.';
      return;
    }

    const error = err.error;

    if (typeof error === 'string') {
      this.serverError = error;
      return;
    }

    if (Array.isArray(error)) {
      this.serverError = error.map((e: any) => e.description || e).join('<br>');
      return;
    }

    if (error.errors) {
      const temp: any = {};

      Object.keys(error.errors).forEach(key => {
        const message = error.errors[key][0];

        const camel = key.charAt(0).toLowerCase() + key.slice(1);

        temp[camel] = message;
        temp[key] = message; // support PascalCase too
      });

      this.fieldErrors = temp;
      this.serverError = 'Please correct highlighted fields.';
      return;
    }

    if (error.message) {
      this.serverError = error.message;
      return;
    }

    this.serverError = 'Registration failed.';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
