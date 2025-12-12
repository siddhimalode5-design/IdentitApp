import { Component,computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth/auth';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isLoggedIn = computed(() => this.auth.isLoggedIn());
  user = computed(() => this.auth.user());

  constructor(private auth: Auth) {}

  logout() {
    this.auth.logout();
  }
}

 
 

 
