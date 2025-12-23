import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SakaiLayout } from './sakai-layout';

describe('SakaiLayout', () => {
  let component: SakaiLayout;
  let fixture: ComponentFixture<SakaiLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SakaiLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SakaiLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
