import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stocks } from './stocks';

describe('Stocks', () => {
  let component: Stocks;
  let fixture: ComponentFixture<Stocks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stocks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stocks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
