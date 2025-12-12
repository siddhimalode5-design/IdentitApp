import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
 


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule,CardModule,DividerModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
