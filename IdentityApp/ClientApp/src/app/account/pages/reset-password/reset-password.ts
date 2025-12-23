import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Account } from '../../../account/account';
import { MessageModule } from 'primeng/message'; // <-- import this

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    MessageModule
    
  ],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword implements OnInit {

  form!: FormGroup;
  loading = false;
  token!: string;
  email!: string;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private account: Account
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    if (!this.token || !this.email) {
      this.error = 'Invalid or expired reset link.';
      return;
    }

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(group: FormGroup) {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p === c ? null : { notMatching: true };
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    const payload = {
      email: this.email,
      token: this.token,
      password: this.form.value.password
    };

    this.account.resetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        alert('Password reset successful. Please login.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error || 'Reset failed. Please try again.';
      }
    });
  }
}
