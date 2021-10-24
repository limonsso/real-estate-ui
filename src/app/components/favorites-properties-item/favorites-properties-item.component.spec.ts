import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesPropertiesItemComponent } from './favorites-properties-item.component';

describe('FavoritesPropertiesItemComponent', () => {
  let component: FavoritesPropertiesItemComponent;
  let fixture: ComponentFixture<FavoritesPropertiesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesPropertiesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesPropertiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
