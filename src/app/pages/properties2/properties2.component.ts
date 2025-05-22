import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Pagination, Property } from '@models/app.models';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@ngbracket/ngx-layout';
import { AppService } from '@services/app.service';
import { DomHandlerService } from '@services/dom-handler.service';
import { Settings, SettingsService } from '@services/settings.service';
import { ClientsComponent } from '@shared-components/clients/clients.component';
import { GetInTouchComponent } from '@shared-components/get-in-touch/get-in-touch.component';
import { HeaderImageComponent } from '@shared-components/header-image/header-image.component';
import { PropertiesSearchResultsFiltersComponent } from '@shared-components/properties-search-results-filters/properties-search-results-filters.component';
import { PropertiesSearchComponent } from '@shared-components/properties-search/properties-search.component';
import { PropertiesToolbarComponent } from '@shared-components/properties-toolbar/properties-toolbar.component';
import { PropertyItemComponent } from '@shared-components/property-item/property-item.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { debounceTime, distinctUntilChanged, filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-properties2',
  imports: [

    PropertiesSearchComponent,
  ],
  templateUrl: './properties2.component.html',
  styleUrl: './properties2.component.scss'
})
export class Properties2Component {

}
