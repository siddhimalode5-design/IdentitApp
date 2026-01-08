import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditUserEmailDialog } from './admin-edit-user-email-dialog';

describe('AdminEditUserEmailDailog', () => {
  let component: AdminEditUserEmailDialog;
  let fixture: ComponentFixture<AdminEditUserEmailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditUserEmailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditUserEmailDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
