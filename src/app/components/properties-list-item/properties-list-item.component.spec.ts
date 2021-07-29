import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesListItemComponent } from './properties-list-item.component';

describe('PropertiesListItemComponent', () => {
  let component: PropertiesListItemComponent;
  let fixture: ComponentFixture<PropertiesListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
