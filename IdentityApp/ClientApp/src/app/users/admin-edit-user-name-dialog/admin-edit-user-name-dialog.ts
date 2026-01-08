import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
 
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-edit-user-name-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,  
  ],
  templateUrl: './admin-edit-user-name-dialog.html'
})
export class AdminEditUserNameDialog {

  @Input() visible = false;

  /** full name shown in input */
  @Input() fullName = '';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();
}
