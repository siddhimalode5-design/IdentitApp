import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule,FormGroup  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Account } from '../../../account/account';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RouterModule
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']

})
export class ForgotPassword implements OnInit{

  loading = false;
  form!: FormGroup; // declared, not initialized

  constructor(private fb: FormBuilder,
     private account: Account
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
     if (this.form.invalid) return;

    this.loading = true;
    const email = this.form.value.email;

    this.account.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        alert('If this email exists, a reset link has been sent.');
      },
      error: () => {
        this.loading = false;
        alert('Something went wrong. Please try again.');
      }
    });
  }
}

 
 

 