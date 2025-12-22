import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
 
import { TagModule } from 'primeng/tag';

import { AdminUsers } from '../layout/service/admin-users';
import { Auth } from '../auth/auth';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
     
    TagModule
  ],
  templateUrl: './users.html'
})
export class Users implements OnInit {

  users: any[] = [];
  currentUserEmail!: string;

  constructor(
    private adminUsersService: AdminUsers,
    private authService: Auth
  ) {}

  ngOnInit() {
    this.currentUserEmail = this.authService.getEmail();
    this.loadUsers();
  }

  loadUsers() {
    this.adminUsersService.getConfirmedUsers()
      .subscribe(res => {
        this.users = res.users;
      });
  }

  toggleLock(user: any) {
  if (user.lockoutEnd) {
    this.adminUsersService.unlockUser(user.id)
      .subscribe(() => this.loadUsers());
  } else {
    this.adminUsersService.lockUser(user.id)
      .subscribe(() => this.loadUsers());
  }
}


  deleteUser(user: any) {
    if (confirm(`Delete ${user.firstName}?`)) {
      this.adminUsersService.deleteUser(user.id)
        .subscribe(() => this.loadUsers());
    }
  }

  isSelf(user: any): boolean {
    return user.email === this.currentUserEmail;
  }
}
