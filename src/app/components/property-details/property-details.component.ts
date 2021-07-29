import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  Gallery,
  GalleryItem,
  ThumbnailsPosition,
  ImageSize, ImageItem
} from "ng-gallery";
import {range} from "lodash";
import {PropertyService} from "../../services/property.service";
import {PropertyDetails} from "../../models/property-details";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {
  imgItems!: GalleryItem[];
  propertyDetails! : PropertyDetails;

  @ViewChild("itemTemplate", { static: true }) itemImgTemplate!: TemplateRef<any>;

  constructor(private readonly route: ActivatedRoute, private readonly propertyService: PropertyService) { }

  ngOnInit(): void {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const propertyId = Number(routeParams.get('propertyId'));
    this.propertyService.getPropertyDetails(propertyId)
      .subscribe((data) => {
        console.log(data);
        this.propertyDetails = data

        // Creat gallery items
        this.imgItems = this.propertyDetails.images.map(src => {
          return new ImageItem({src : src, thumb : src});
        });
      });
  }

}
