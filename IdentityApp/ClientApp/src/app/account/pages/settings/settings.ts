import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports:[CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  user: any;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.user = this.auth.user();
  }
}
