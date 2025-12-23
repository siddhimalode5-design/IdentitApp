import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../auth';    // <-- correct path because auth.ts is in same folder

export const authGuard: CanActivateFn = () => {
 const auth = inject(Auth);
  const router = inject(Router);

  // IMPORTANT: use token presence, not signal reactivity
  const token = auth.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  
  return false;

  
};
