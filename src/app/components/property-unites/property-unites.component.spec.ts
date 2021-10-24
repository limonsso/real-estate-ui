import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyUnitesComponent } from './property-unites.component';

describe('PropertyUnitesComponent', () => {
  let component: PropertyUnitesComponent;
  let fixture: ComponentFixture<PropertyUnitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyUnitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyUnitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
