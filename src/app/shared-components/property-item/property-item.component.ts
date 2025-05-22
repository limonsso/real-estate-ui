import { Component, OnInit, Input, ViewChild, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { Property } from '@models/app.models';
import { SwiperDirective } from '../../theme/components/swiper/swiper.directive';
import { SwiperConfigInterface, SwiperModule, SwiperPaginationInterface } from '../../theme/components/swiper/swiper.module';
import { Settings, SettingsService } from '@services/settings.service';
import { AppService } from '@services/app.service';
import { CompareOverviewComponent } from '@shared-components/compare-overview/compare-overview.component';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RatingComponent } from '@shared-components/rating/rating.component';

@Component({
    selector: 'app-property-item',
    imports: [
        RouterModule,
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        SwiperModule,
        CurrencyPipe,
        RatingComponent,
        DatePipe
    ],
    templateUrl: './property-item.component.html',
    styleUrls: ['./property-item.component.scss']
})
export class PropertyItemComponent implements OnInit {
  @Input() property: Property;
  @Input() viewType: string = "grid";
  @Input() viewColChanged: number = 0;
  @Input() fullWidthPage: boolean = true;
  public column: number = 4; 
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  public settings: Settings;
  constructor(public settingsService: SettingsService, public appService: AppService, public cdr: ChangeDetectorRef) {
    this.settings = this.settingsService.settings;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initCarousel(); 
    this.cdr.detectChanges();
    // this.appService.getAddress(this.property.location.lat, this.property.location.lng).subscribe(data=>{
    //   console.log(data['results'][0]['formatted_address']);
    //   this.address = data['results'][0]['formatted_address'];
    // })
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.viewColChanged) {
      this.getColumnCount(changes.viewColChanged.currentValue);
      if (!changes.viewColChanged.isFirstChange()) {
        if (this.property.gallery.length > 1) {
          this.directiveRef.update();
        }
      }
    } 

    for (let propName in changes) {
      // let changedProp = changes[propName];
      // if (!changedProp.isFirstChange()) {
      //   if(this.property.gallery.length > 1){
      //     this.initCarousel();
      //     this.config.autoHeight = true;       
      //     this.directiveRef.update();  
      //   }       
      // }      
    }
  }

  public getColumnCount(value) {
    if (value == 25) {
      this.column = 4;
    }
    else if (value == 33.3) {
      this.column = 3;
    }
    else if (value == 50) {
      this.column = 2
    }
    else {
      this.column = 1;
    }
  }

  public getStatusBgColor(status) {
    switch (status) {
      case 'For Sale':
        return '#558B2F';
      case 'For Rent':
        return '#1E88E5';
      case 'Open House':
        return '#009688';
      case 'No Fees':
        return '#FFA000';
      case 'Hot Offer':
        return '#F44336';
      case 'Sold':
        return '#000';
      default:
        return '#01579B';
    }
  }


  public initCarousel() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: false,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: true,
      nested: true,
      // autoplay: {
      //   delay: 5000,
      //   disableOnInteraction: false
      // },
      speed: 500,
      effect: "slide"
    }
  }


  public addToCompare() {
    this.appService.addToCompare(this.property, CompareOverviewComponent, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onCompare() {
    return this.appService.Data.compareList.filter(item => item.id == this.property.id)[0];
  }

  public addToFavorites() {
    this.appService.addToFavorites(this.property, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onFavorites() {
    return this.appService.Data.favorites.filter(item => item.id == this.property.id)[0];
  }


}
