 import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h1>Welcome to your Dashboard</h1>
    <p>This page is only accessible when logged in.</p>
  `
})
export class Dashboard {}
