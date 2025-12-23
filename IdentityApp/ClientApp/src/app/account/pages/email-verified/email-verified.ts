import { Component, OnInit } from '@angular/core';
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
export class EmailVerified implements OnInit {

  isSuccess: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
