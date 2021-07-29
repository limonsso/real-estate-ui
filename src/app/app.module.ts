import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PropertiesListComponent } from './components/properties-list/properties-list.component';
import { PropertiesListItemComponent } from './components/properties-list-item/properties-list-item.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {HttpClientModule} from "@angular/common/http";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { SearchPropertiesComponent } from './components/search-properties/search-properties.component';
import {AppRouteModule} from "./app-route/app-route.module";
import { LoginComponent } from './components/login/login.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { GalleryModule } from 'ng-gallery';
import {ImageViewerModule} from "@hallysonh/ngx-imageviewer";
import {StoreModule} from "@ngrx/store";
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import {reducer} from './store/reducers/localities-strore.reducer';
import {LocalitiesStoreEffects} from "./store/effects/localities-store.effects";

@NgModule({
  declarations: [
    AppComponent,
    PropertiesListComponent,
    PropertiesListItemComponent,
    PropertyDetailsComponent,
    SearchPropertiesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    AppRouteModule,
    MatPaginatorModule,
    GalleryModule,
    ImageViewerModule,
    StoreModule.forRoot({localitiesReducer: reducer}),
    EffectsModule.forRoot([LocalitiesStoreEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
