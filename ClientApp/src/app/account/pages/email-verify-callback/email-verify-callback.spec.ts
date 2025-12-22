import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifyCallback } from './email-verify-callback';

describe('EmailVerifyCallback', () => {
  let component: EmailVerifyCallback;
  let fixture: ComponentFixture<EmailVerifyCallback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerifyCallback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerifyCallback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
