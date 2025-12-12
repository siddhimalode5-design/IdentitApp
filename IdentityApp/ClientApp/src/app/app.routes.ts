import { Routes } from '@angular/router';
import { Login } from './account/pages/login/login';
import { Register } from './account/pages/register/register';
import {Home} from './home/home';
import { VerifyEmail } from './account/pages/verify-email/verify-email';
import { VerifyEmailInfo } from './account/pages/verify-email-info/verify-email-info';
import { EmailVerified } from './account/pages/email-verified/email-verified';
import { EmailVerificationFailed } from './account/pages/email-verification-failed/email-verification-failed';
import {NotFound} from './layout/shared/components/errors/not-found/not-found';
import { authGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
     { path: 'home', component: Home }, 
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verify-email', component: VerifyEmail },
  { path: 'verify-email-info', component: VerifyEmailInfo},
  { path: 'email-verified', component: EmailVerified },
  { path: 'email-verification-failed', component: EmailVerificationFailed },
  {path: 'not-found',component:NotFound},
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  // { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./profile/profile').then(m => m.Profile) },
  {path:'**',component:NotFound,pathMatch:'full'},
  
   

];
