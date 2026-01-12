import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminUsers } from '../../layout/service/admin-users';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-admin-edit-user-dialog',
  standalone: true,
  templateUrl: './admin-edit-user-dialog.html',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule
  ]
})
export class AdminEditUserDialog {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

@Output() userUpdated = new EventEmitter<any>();

  @Input() user: any;

  form: FormGroup;

  private originalFullName = '';
  private originalEmail = '';

  constructor(
    private fb: FormBuilder,
    private adminUsers: AdminUsers,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnChanges() {
  if (!this.user) return;

  this.form.patchValue({
    fullName: this.user.firstName + ' ' + this.user.lastName,
    email: this.user.email
  });

  // store original values for comparison
  this.originalFullName = this.form.value.fullName;
  this.originalEmail = this.form.value.email;
}


  hasChanges(): boolean {
    return (
      this.form.value.fullName !== this.originalFullName ||
      this.form.value.email !== this.originalEmail
    );
  }

save() {
  const { fullName, email } = this.form.value;

  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  const isNameChanged = fullName !== this.originalFullName;
  const isEmailChanged = email !== this.originalEmail;

  const requests = [];

  if (isNameChanged) {
    requests.push(
      this.adminUsers.updateUserBasicInfo(
        this.user.id,
        firstName,
        lastName
      )
    );
  }

  if (isEmailChanged) {
    requests.push(
      this.adminUsers.changeUserEmail(this.user.id, {
        newEmail: email
      })
    );
  }

  Promise.all(requests.map(r => r.toPromise()))
  .then(() => {
    if (isEmailChanged) {
      this.close();
      localStorage.clear();
      window.location.href =
        `/verify-email-info?email=${encodeURIComponent(email)}`;
      return;
    }

    this.userUpdated.emit({
      ...this.user,
      firstName,
      lastName
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Updated',
      detail: 'User name updated successfully'
    });

    this.close();
  })
  .catch((err) => {
    if (err?.error === 'Email already exists') {
      this.messageService.add({
        severity: 'error',
        summary: 'Email already exists',
        detail: 'Please use a different email'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Update failed',
        detail: 'Something went wrong'
      });
    }
  });
}


close() {
    this.visibleChange.emit(false);
    this.form.reset();
  }
}
