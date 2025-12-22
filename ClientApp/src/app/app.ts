import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Navbar } from './navbar/navbar'; 
import {Footer} from './footer/footer';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule,Navbar,Footer],
  templateUrl: './app.html',
  // styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ClientApp');
}
