import { TestBed } from '@angular/core/testing';

import { MortgageCalculatorService } from './mortgage-calculator.service';

describe('MortgageCalcultorService', () => {
  let service: MortgageCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MortgageCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
