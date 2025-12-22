import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-email-verification-failed',
  standalone: true,
  imports: [Card, Button, Divider],
  templateUrl: './email-verification-failed.html',
  styleUrls: ['./email-verification-failed.css'],
})
export class EmailVerificationFailed {
  
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
