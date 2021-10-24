import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPerformanceComponent } from './property-performance.component';

describe('PropertyPerformanceComputingComponent', () => {
  let component: PropertyPerformanceComponent;
  let fixture: ComponentFixture<PropertyPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
