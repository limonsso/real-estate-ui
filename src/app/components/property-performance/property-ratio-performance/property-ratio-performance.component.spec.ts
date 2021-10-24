import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyRatioPerformanceComponent } from './property-ratio-performance.component';

describe('PropertyRatioPerformanceComponent', () => {
  let component: PropertyRatioPerformanceComponent;
  let fixture: ComponentFixture<PropertyRatioPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyRatioPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyRatioPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
