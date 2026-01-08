import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditUserNameDialog } from './admin-edit-user-name-dialog';

describe('AdminEditUserNameDialog', () => {
  let component: AdminEditUserNameDialog;
  let fixture: ComponentFixture<AdminEditUserNameDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditUserNameDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditUserNameDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
