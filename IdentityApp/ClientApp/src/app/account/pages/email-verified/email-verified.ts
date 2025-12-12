import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
 
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-email-verified',
  standalone: true,
   imports: [Card, Button, Divider],
  templateUrl: './email-verified.html',
  styleUrls: ['./email-verified.css'],
})
export class EmailVerified {

  isSuccess: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isSuccess = params['status'] === 'success';
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
