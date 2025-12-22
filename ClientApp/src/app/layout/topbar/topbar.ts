import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}

 
 

 

