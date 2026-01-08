import { Component, Input,Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AdminUsers } from '../../layout/service/admin-users';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-admin-edit-user-email-dialog',
  templateUrl: './admin-edit-user-email-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ]
 
})
export class AdminEditUserEmailDialog {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>(); // ✅ REQUIRED

  @Input() user: any;

  emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminUsersService: AdminUsers,
    private messageService: MessageService
  ) {
    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnChanges() {
    if (this.user) {
      this.emailForm.patchValue({
        newEmail: this.user.email
      });
    }
  }

  submit() {
    if (this.emailForm.invalid) return;

    const dto = { newEmail: this.emailForm.value.newEmail };

    this.adminUsersService.changeUserEmail(this.user.id, dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Verification link sent to new email.'
        });
        this.close(); // ✅
      }
    });
  }

  close() {
    this.emailForm.reset();
    this.visibleChange.emit(false); // ✅ notify parent
  }
}

