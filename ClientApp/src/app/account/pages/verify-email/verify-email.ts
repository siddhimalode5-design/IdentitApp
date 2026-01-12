import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
export class VerifyEmail  {
// private readonly baseApi = 'https://localhost:7008';
//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     const userId = this.route.snapshot.queryParamMap.get('userId');
//     const token = this.route.snapshot.queryParamMap.get('token');
//     const email = this.route.snapshot.queryParamMap.get('email');
//     const type = this.route.snapshot.queryParamMap.get('type'); // register | change

//     if (!userId || !token) {
//       this.router.navigate(['/not-found']);
//       return;
//     }

//     // 🔁 Decide backend endpoint
    
// const url =
//       type === 'change'
//         ? `${this.baseApi}/api/account/confirm-email-change`
//         : `${this.baseApi}/api/account/confirm-email`;


//    this.http.post(url, null, {
//   params: { userId, token, email: email ?? '' }
// }).subscribe({
//   next: () => {
//     this.router.navigate(['/login'], {
//       queryParams: { verified: true }
//     });
//   },
//   error: () => {
//     this.router.navigate(['/not-found']);
//   }
// });

//   }
}
