import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Account } from '../../account';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-verify-email-info',
  imports: [ButtonModule, CommonModule],
  standalone: true,
  templateUrl: './verify-email-info.html',
    styleUrls: ['./verify-email-info.css'], // fixed
})
export class VerifyEmailInfo {
   email: string = "";
   loading: boolean = false;
   serverMessage: string = "";

  constructor(private route: ActivatedRoute, private account: Account) {
    this.email = this.route.snapshot.queryParamMap.get('email') || "";
  }

  resendEmail() {
    if (!this.email) return;

    this.loading = true;
    this.serverMessage = '';

    this.account.resendConfirmationEmail(this.email)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.serverMessage = 'Verification email has been resent. Please check your inbox.';
        },
        error: () => {
          this.serverMessage = 'Failed to resend email. Please try again later.';
        }
      });
  }
}
