import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PropertiesListComponent } from './components/properties-list/properties-list.component';
import { PropertiesListItemComponent } from './components/properties-list-item/properties-list-item.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
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
import { AngularWebStorageModule } from 'angular-web-storage';

import {reducer} from './store/reducers/localities-strore.reducer';
import {LocalitiesStoreEffects} from "./store/effects/localities-store.effects";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import { HeaderComponent } from './components/header/header.component';
import {JwtInterceptor} from "./helpers/interceptors/jwt.interceptor";
import { PropertyMortgageCalculatorComponent } from './components/property-details/property-mortgage-calculator/property-mortgage-calculator.component';
import {MatBadgeModule} from "@angular/material/badge";
import { FavoritesPropertiesComponent } from './components/favorites-properties/favorites-properties.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { FavoritesPropertiesItemComponent } from './components/favorites-properties-item/favorites-properties-item.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr-CA';
import { PropertyUnitesComponent } from './components/property-unites/property-unites.component';
import { PropertyPerformanceComponent } from './components/property-performance/property-performance.component';
import { PropertyRatioPerformanceComponent } from './components/property-performance/property-ratio-performance/property-ratio-performance.component';
registerLocaleData(localeFr, 'fr-CA');

@NgModule({
  declarations: [
    AppComponent,
    PropertiesListComponent,
    PropertiesListItemComponent,
    PropertyDetailsComponent,
    SearchPropertiesComponent,
    LoginComponent,
    HeaderComponent,
    PropertyMortgageCalculatorComponent,
    FavoritesPropertiesComponent,
    PageTitleComponent,
    FavoritesPropertiesItemComponent,
    PropertyUnitesComponent,
    PropertyPerformanceComponent,
    PropertyRatioPerformanceComponent
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
        AngularWebStorageModule,
        StoreModule.forRoot({localities: reducer}),
        EffectsModule.forRoot([LocalitiesStoreEffects]),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        }),
        MatIconModule,
        MatTabsModule,
        MatBadgeModule,
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: LOCALE_ID,
      useValue: 'fr-CA' // 'de' for Germany, 'fr' for France ...
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
