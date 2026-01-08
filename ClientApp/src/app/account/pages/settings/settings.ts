import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../auth/auth';
import { Account } from '../../account';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  user: any;
  success = '';

  showChangePassword = false;
  loading = false;
  error = '';

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private auth: Auth,
    private account: Account
  ) {}

  ngOnInit() {
    this.user = this.auth.user();
  }

  openChangePassword() {
  this.showChangePassword = true;
  this.error = '';
  this.success = '';
}

closeChangePassword() {
  this.showChangePassword = false;
  this.error = '';
  this.success = '';
  this.passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
}


  changePassword() {
  this.error = '';
  this.success = '';

  // 🔴 1. New password must be different from current password
  if (this.passwordForm.currentPassword === this.passwordForm.newPassword) {
    this.error = 'New password must be different from current password';
    return;
  }

  // 🔴 2. New password and confirm password must match
  if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
    this.error = 'New passwords do not match';
    return;
  }

  this.loading = true;

  // 🔵 3. Call backend only if validations pass
  this.account.changePassword(this.passwordForm).subscribe({
    next: () => {
      this.loading = false;
      this.success = 'Password changed successfully. Please login again.';

      setTimeout(() => this.closeChangePassword(), 1500);
      setTimeout(() => this.auth.logout(), 2500);
    },
    error: (err: any) => {
      this.loading = false;
      this.error =
        err?.error?.message ||
        'Failed to change password. Please try again.';
    },
  });
}

}
