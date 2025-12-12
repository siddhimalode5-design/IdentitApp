import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationFailed } from './email-verification-failed';

describe('EmailVerificationFailed', () => {
  let component: EmailVerificationFailed;
  let fixture: ComponentFixture<EmailVerificationFailed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationFailed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerificationFailed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
