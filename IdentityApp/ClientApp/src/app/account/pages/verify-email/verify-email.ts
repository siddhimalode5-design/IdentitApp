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
export class VerifyEmail {

}
