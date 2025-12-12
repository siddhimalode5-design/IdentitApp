import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email-info',
  imports: [ButtonModule,CommonModule],
  standalone: true,
  templateUrl: './verify-email-info.html',
  styleUrl: './verify-email-info.css',
})
export class VerifyEmailInfo {
   email: string = "";

  constructor(private route: ActivatedRoute, private router: Router) {
    this.email = this.route.snapshot.queryParamMap.get('email') || "";
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}

 
 

 