import { TestBed } from '@angular/core/testing';

import { AdminUsers } from '../../layout/service/admin-users';

describe('AdminUsers', () => {
  let service: AdminUsers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminUsers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
