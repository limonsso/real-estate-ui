import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  Gallery,
  GalleryItem,
  ThumbnailsPosition,
  ImageSize, ImageItem
} from "ng-gallery";
import { range } from "lodash";
import { PropertyService } from "../../services/property.service";
import { PropertyDetails } from "../../models/property-details";
import { ActivatedRoute, Router } from "@angular/router";
import { BroadcastService } from "../../services/broadcast.service";
import { UserService } from "../../services/user.service";
import { Observable, of } from "rxjs";
import { FavoriteProperty } from "../../models/favorite-property";
import { PropertyMapInfo } from "../../models/property-map-info";

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {
  imgItems!: GalleryItem[];
  propertyDetails!: PropertyDetails;
  @ViewChild("itemTemplate", { static: true }) itemImgTemplate!: TemplateRef<any>;
  public mapInfos: PropertyMapInfo[];

  constructor(private readonly route: ActivatedRoute,
    private readonly propertyService: PropertyService,
    private readonly broadcastService: BroadcastService,
    private readonly userService: UserService,
    private readonly elRef: ElementRef,
    private readonly router: Router) { }

  ngOnInit(): void {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const propertyId = Number(routeParams.get('propertyId'));
    this.propertyService.getPropertyDetails(propertyId)
      .subscribe((data) => {
        console.log(data);
        this.propertyDetails = data
        this.broadcastService.broadcast("property-details-load-completed", this.propertyDetails.price)
        // Creat gallery items
        if (this.propertyDetails.images) {
          this.imgItems = this.propertyDetails.images.map(src => {
            return new ImageItem({ src: src, thumb: src });
          });
        }
      });
  }

  goToOriginLink() {
    if (this.propertyDetails.company === 'Remax') {
      window.location.href = `https://www.remax-quebec.com/${this.propertyDetails.link}`;
    }
    if (this.propertyDetails.company === 'Centris') {
      window.location.href = `https://www.centris.ca${this.propertyDetails.link}`;
    }
    if (this.propertyDetails.company === 'Duproprio') {
      window.location.href = `${this.propertyDetails.link}`;
    }
  }

  addOrRemoveToFavorites($event) {
    var el = $event.target.querySelector('.material-icons-outlined')
      ?? $event.target.parentElement.querySelector('.material-icons-outlined')
    console.log(el);
    let favoritesProperties = this.userService.currentUserValue.favoritesProperties.map(x => { return x.propertyId });
    if (favoritesProperties && favoritesProperties.includes(this.propertyDetails.id)) {
      el.innerHTML = 'favorite_outline'
      this.userService.deleteFavoriteProperty(this.propertyDetails.id);
    } else {
      this.userService.saveFavoriteProperty(new FavoriteProperty(this.propertyDetails.id, null));
      el.innerHTML = 'favorite'
    }
    this.broadcastService.broadcast('favorites-add-or-remove')
  }

  isFavoriteProperty(): Observable<boolean> {
    let favoritesProperties = this.userService.currentUserValue.favoritesProperties.map(x => { return x.propertyId });
    if (favoritesProperties.includes(this.propertyDetails.id)) {
      return of(true);
    } else {
      return of(false);
    }
  }

  redirectToCalulator() {
    this.router.navigate([`/property-performance/${this.propertyDetails.id}`])
  }
}
