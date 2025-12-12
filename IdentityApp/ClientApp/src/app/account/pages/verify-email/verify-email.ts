import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

// Angular modules
import { CommonModule } from '@angular/common';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ProgressSpinnerModule
  ],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmail implements OnInit {

  loading = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get("email");
    const token = this.route.snapshot.queryParamMap.get("token");

    console.log("EMAIL:", email);
    console.log("TOKEN:", token);

    if (!email || !token) {
      this.loading = false;

      // Redirect user to FAILED screen
      setTimeout(() => {
        this.router.navigate(['/email-verification-failed']);
      }, 1000);

      return;
    }

    const payload = { email, token };

    this.http.put("http://localhost:5170/api/Account/confirm-email", payload)
      .subscribe({
        next: () => {
          this.loading = false;

          // Redirect user to SUCCESS screen
          setTimeout(() => {
            this.router.navigate(['/email-verified']);
          }, 1500);
        },
        error: () => {
          this.loading = false;

          // Redirect user to FAILED screen
          setTimeout(() => {
            this.router.navigate(['/email-verification-failed']);
          }, 1500);
        }
      });
  }
}
