import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { Auth } from '../../auth/auth'; 
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
     model: MenuItem[] = [];

    constructor(private auth: Auth) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Main',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-home',
                        routerLink: ['/dashboard']
                    }
                ]
            },
            {
                label: 'Management',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-users',
                        routerLink: ['/users'],
                        visible: this.auth.user()?.roles?.includes('Admin')
                    }
                ]
            },
            {
                label: 'Settings',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        routerLink: ['/settings']
                    }
                ]
            }
        ];
    }
}
