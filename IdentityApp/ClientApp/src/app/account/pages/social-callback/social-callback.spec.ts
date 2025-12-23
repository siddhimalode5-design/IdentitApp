import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCallback } from './social-callback';

describe('SocialCallback', () => {
  let component: SocialCallback;
  let fixture: ComponentFixture<SocialCallback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialCallback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialCallback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
