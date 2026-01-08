import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-not-found',
  imports: [ButtonModule,AppFloatingConfigurator,RouterModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {

}
