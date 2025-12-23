import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../auth/auth';

@Component({
  selector: 'app-social-callback',
  template: `<p>Signing you in...</p>`
})
export class SocialCallback implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
  const token = this.route.snapshot.queryParamMap.get('token');
  const email = this.route.snapshot.queryParamMap.get('email');
  const rolesParam = this.route.snapshot.queryParamMap.get('roles');

  if (!token || !email) {
    this.router.navigate(['/login']);
    return;
  }

  const user = {
    email,
    roles: rolesParam ? rolesParam.split(',') : []
  };

  // ✅ FIXED: use correct variables
  this.auth.login(token, user, true);

  // ✅ Redirect after successful login
  this.router.navigate(['/dashboard']);
}

}
