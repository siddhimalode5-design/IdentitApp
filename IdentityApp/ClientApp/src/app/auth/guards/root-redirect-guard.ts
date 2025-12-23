import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const rootRedirectGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};
