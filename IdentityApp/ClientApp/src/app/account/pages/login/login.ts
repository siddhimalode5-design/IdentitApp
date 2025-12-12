import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Auth } from '../../../auth/auth';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';

import { Account } from '../../../account/account'; // adjust path if needed

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    DividerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  form!: FormGroup;
  loading = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private account: Account,
    private auth: Auth
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  get(field: string) {
    return this.form.get(field);
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.serverError = '';
    this.loading = true;

    const payload = {
      userName: (this.get('email')!.value || '').toString().toLowerCase(),
      password: this.get('password')!.value,
      // backend LoginDto doesn't contain rememberMe, but you may include it if server expects it
    };

    this.account.login(payload).subscribe({
      next: (res: any) => {
  this.loading = false;

  const token = res.jwt;
  if (token) {

    const userData = {
      firstName: res.firstName,
      lastName: res.lastName
    };

    this.auth.login(token, userData);

    this.router.navigate(['/dashboard']);
    return;
  }

  this.serverError = 'Unexpected server response.';
},


      error: (err: any) => {
        this.loading = false;

        // backend returns Unauthorized(...) with a plain string message
        // err.error may be a string or object depending on ASP.NET response pipeline
        const message = this._extractErrorMessage(err);

        // provide helpful client-side mapping
        if (/confirm/i.test(message) || /confirm your email/i.test(message)) {
          // user hasn't verified email
          this.serverError = 'Please confirm your email before logging in. Check your inbox.';
          // optionally navigate to a resend-confirmation page
          return;
        }

        if (/invalid username or password/i.test(message) || /invalid username/i.test(message) || /invalid password/i.test(message) || /unauthorized/i.test(message)) {
          this.serverError = 'Email or password is incorrect.';
          return;
        }

        this.serverError = message || 'Login failed. Try again later.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgot() {
    this.router.navigate(['/forgot-password']);
  }

  private _extractErrorMessage(err: any): string {
    if (!err) return 'Unknown error';
    // if backend returned a simple string in body
    if (typeof err.error === 'string') return err.error;

    // if backend returned { message: "..."}
    if (err.error && err.error.message) return err.error.message;

    // if validation ModelState returned
    if (err.error && typeof err.error === 'object') {
      // take first property
      const keys = Object.keys(err.error);
      if (keys.length) {
        const v = err.error[keys[0]];
        if (Array.isArray(v)) return v[0];
        if (typeof v === 'string') return v;
      }
    }

    // fallback to status text
    if (err.statusText) return err.statusText;

    return 'Server error';
  }
}
