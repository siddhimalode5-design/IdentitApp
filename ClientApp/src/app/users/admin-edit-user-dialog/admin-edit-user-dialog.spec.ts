import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditUserDialog } from './admin-edit-user-dialog';

describe('AdminEditUserDialog', () => {
  let component: AdminEditUserDialog;
  let fixture: ComponentFixture<AdminEditUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditUserDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditUserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
