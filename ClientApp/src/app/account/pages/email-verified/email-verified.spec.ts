import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerified } from './email-verified';

describe('EmailVerified', () => {
  let component: EmailVerified;
  let fixture: ComponentFixture<EmailVerified>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerified]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerified);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
