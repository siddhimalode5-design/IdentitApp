import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rootRedirectGuard } from './root-redirect-guard';

describe('rootRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rootRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
