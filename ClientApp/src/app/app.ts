import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
// import { Navbar } from './navbar/navbar'; 
// import {Footer} from './footer/footer';
@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,ButtonModule],
  templateUrl: './app.html',
  // styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ClientApp');
}
