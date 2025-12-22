import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Topbar } from '../topbar/topbar';
import { Sidebar } from '../sidebar/sidebar';


@Component({
  selector: 'app-sakai-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Topbar,
    Sidebar
  ],
  templateUrl: './sakai-layout.html',
  styleUrl: './sakai-layout.css',
})
export class SakaiLayout {

}

 
 
 