import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesPropertiesComponent } from './favorites-properties.component';

describe('FavoritesPropertiesComponent', () => {
  let component: FavoritesPropertiesComponent;
  let fixture: ComponentFixture<FavoritesPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
