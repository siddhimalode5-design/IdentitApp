import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
 
import { TagModule } from 'primeng/tag';

import { AdminUsers } from '../layout/service/admin-users';
import { Auth } from '../auth/auth';
import { AdminEditUserNameDialog } from '../users/admin-edit-user-name-dialog/admin-edit-user-name-dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminEditUserEmailDialog } from '../users/admin-edit-user-email-dialog/admin-edit-user-email-dialog';
import { TooltipModule } from 'primeng/tooltip';
import { AdminEditUserDialog } from '../users/admin-edit-user-dialog/admin-edit-user-dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    TooltipModule, 
    TagModule,
    AdminEditUserNameDialog,
    AdminEditUserEmailDialog,
    AdminEditUserDialog,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './users.html'
})
export class Users implements OnInit {

  users: any[] = [];
  currentUserEmail!: string;
  search = '';
  totalUsers = 0;
activeUsers = 0;
lockedUsers = 0;
showEditNameDialog = false;
selectedUser: any = null;
emailDialogVisible = false;
editDialogVisible = false;

  constructor(
    private adminUsersService: AdminUsers,
    private authService: Auth,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUserEmail = this.authService.getEmail();
    this.loadUsers();
  }

  loadUsers() {
  this.adminUsersService
    .getConfirmedUsers(this.search)
    .subscribe(res => {
      this.users = res.users;
      this.calculateStats();
    });
}



  onSearchChange(value: string) {
  this.search = value;
  this.loadUsers();
}

calculateStats() {
  this.totalUsers = this.users.length;
  this.activeUsers = this.users.filter(u => !u.isLocked).length;
  this.lockedUsers = this.users.filter(u => u.isLocked).length;
}


  toggleLock(user: any) {
  if (user.isLocked) {
    this.adminUsersService.unlockUser(user.id)
      .subscribe(() => this.loadUsers());
  } else {
    this.adminUsersService.lockUser(user.id)
      .subscribe(() => this.loadUsers());
  }
}


 toggleSuspend(user: any) {
  const action = user.isDeleted ? 'Unsuspend' : 'Suspend';

  if (confirm(`${action} ${user.firstName}?`)) {
    const request = user.isDeleted
      ? this.adminUsersService.unsuspendUser(user.id)
      : this.adminUsersService.suspendUser(user.id);

    request.subscribe(() => this.loadUsers());
  }
}


  isSelf(user: any): boolean {
    return user.email === this.currentUserEmail;
  }

   
openEditName(user: any) {
  if (this.isSelf(user)) {
    this.selectedUser = null; // 🔴 important
    this.showError('You cannot edit your own details');
    return;
  }

  this.selectedUser = user;
  this.showEditNameDialog = true;
}


saveUserName(fullName: string) {

  if (this.isSelf(this.selectedUser)) {
    this.showError('You cannot update your own details');
    this.showEditNameDialog = false;
    return;
  }

  if (!fullName.trim()) {
    this.showError('Name cannot be empty');
    return;
  }

  const parts = fullName.trim().split(' ');
  const firstName = parts.shift()!;
  const lastName = parts.join(' ') || '';

  this.adminUsersService
    .updateUserBasicInfo(this.selectedUser.id, firstName, lastName)
    .subscribe({
      next: () => {
        this.showEditNameDialog = false;
        this.loadUsers();
        this.showSuccess('User name updated successfully');
      },
      error: () => {
        this.showError('Failed to update user name');
      }
    });
}

 

openEditEmail(user: any) {
  if (this.isSelf(user)) {
    this.showError('You cannot change your own email');
    return;
  }
  
  this.selectedUser = user;
  this.emailDialogVisible = true;
}


showError(message: string) {
  this.messageService.add({
    severity: 'warn',
    summary: 'Action not allowed',
    detail: message
  });
}

showSuccess(message: string) {
  this.messageService.add({
    severity: 'success',
    summary: 'Success',
    detail: message
  });
}

 
 

openEdit(user: any) {
  this.selectedUser = user;
  this.editDialogVisible = true;
}

onUserUpdated(updatedUser: any) {
  const index = this.users.findIndex(u => u.id === updatedUser.id);

  if (index !== -1) {
    this.users[index] = updatedUser;
    this.users = [...this.users]; // 🔥 trigger change detection
  }
}


}
