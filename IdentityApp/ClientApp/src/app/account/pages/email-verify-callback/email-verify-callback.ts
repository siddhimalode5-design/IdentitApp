import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../account';

@Component({
  selector: 'app-email-verify-callback',
  imports: [],
  standalone: true,
  template: `<p>Verifying your email...</p>`
})
export class EmailVerifyCallback {
  constructor(
    private route: ActivatedRoute,
    private account: Account,
    private router: Router
  ) {

    const userId = this.route.snapshot.queryParamMap.get('userId');
    const code = this.route.snapshot.queryParamMap.get('code');

    if (userId && code) {
      this.account.verifyEmail(userId, code).subscribe({
        next: () => this.router.navigate(['/login'], {
          queryParams: { verified: true }
        }),
        error: () => this.router.navigate(['/login'], {
          queryParams: { verified: false }
        })
      });
    }
  }

}

 
 
 

