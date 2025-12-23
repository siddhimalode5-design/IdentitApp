import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';

export const adminGuardGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
