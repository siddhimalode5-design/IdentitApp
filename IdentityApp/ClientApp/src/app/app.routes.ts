import { Routes } from '@angular/router';

import { Login } from './account/pages/login/login';
import { Register } from './account/pages/register/register';
import { Home } from './home/home';

import { VerifyEmail } from './account/pages/verify-email/verify-email';
import { VerifyEmailInfo } from './account/pages/verify-email-info/verify-email-info';
import { EmailVerified } from './account/pages/email-verified/email-verified';
import { EmailVerificationFailed } from './account/pages/email-verification-failed/email-verification-failed';

import { NotFound } from './layout/shared/components/errors/not-found/not-found';
import { authGuard } from './auth/guards/auth-guard';
import { rootRedirectGuard } from './auth/guards/root-redirect-guard';
import { adminGuardGuard } from './auth/guards/admin-guard-guard';
import { SakaiLayout } from './layout/sakai-layout/sakai-layout';
import { ForgotPassword } from './account/pages/forgot-password/forgot-password';
import { SocialCallback } from './account/pages/social-callback/social-callback';
import { Settings } from './account/pages/settings/settings';

export const routes: Routes = [
   {
    path: '',
    canActivate: [rootRedirectGuard],
    children:[] // dummy, will never render
  },
   {
    path: 'reset-password',
    loadComponent: () =>
      import('./account/pages/reset-password/reset-password')
        .then(m => m.ResetPassword)
  },

  /* ================= PUBLIC ROUTES (NO LAYOUT) ================= */

   
  { path: 'home', component: Home },
{ path: 'social-callback', component: SocialCallback },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'verify-email', component: VerifyEmail },
  { path: 'verify-email-info', component: VerifyEmailInfo },
  { path: 'email-verified', component: EmailVerified },
  { path: 'email-verification-failed', component: EmailVerificationFailed },
  { path: 'forgot-password', component: ForgotPassword },

  /* ================= PROTECTED SAKAI LAYOUT ================= */

  {
    path: '',
    component: SakaiLayout,
    canActivate: [authGuard],
    children: [
      {
         path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'users',
        loadComponent: () =>
          import('./users/users').then(m => m.Users),
        canActivate: [adminGuardGuard]   // 🔥 THIS IS REQUIRED
  },
  {
  path: 'settings',
  loadComponent: () =>
    import('./account/pages/settings/settings').then(m => m.Settings)
}

   

      // 🔥 future pages (example)
      // {
      //   path: 'profile',
      //   loadComponent: () =>
      //     import('./profile/profile').then(m => m.Profile)
      // }
    ]
  },

  /* ================= FALLBACK ================= */

  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: 'not-found' }

];
