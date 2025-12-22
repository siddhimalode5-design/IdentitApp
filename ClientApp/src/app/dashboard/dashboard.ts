 import { Component } from '@angular/core';
 import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
  templateUrl: './dashboard.html', 
     
})
export class Dashboard {}

 
 
 
     
     
 


 

