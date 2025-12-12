import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailInfo } from './verify-email-info';

describe('VerifyEmailInfo', () => {
  let component: VerifyEmailInfo;
  let fixture: ComponentFixture<VerifyEmailInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
