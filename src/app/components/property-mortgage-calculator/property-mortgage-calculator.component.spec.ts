import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMortgageCalculatorComponent } from './property-mortgage-calculator.component';

describe('PropertyMortgageCalculatorComponent', () => {
  let component: PropertyMortgageCalculatorComponent;
  let fixture: ComponentFixture<PropertyMortgageCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyMortgageCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyMortgageCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
