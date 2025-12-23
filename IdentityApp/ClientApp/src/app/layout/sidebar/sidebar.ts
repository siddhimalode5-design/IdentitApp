import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth/auth';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {

   constructor(public auth: Auth) {}
  isAdmin = false;

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    // role can be string or array depending on JWT
    const role = payload.role;
    this.isAdmin = role === 'Admin' || (Array.isArray(role) && role.includes('Admin'));
  }
}
