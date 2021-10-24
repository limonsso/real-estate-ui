import { Component, OnInit } from '@angular/core';
import {ImageItem} from "ng-gallery";
import {PropertyService} from "../../services/property.service";
import {PropertyDetails} from "../../models/property-details";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {Observable} from "rxjs";
import {BroadcastService} from "../../services/broadcast.service";

@Component({
  selector: 'app-favorites-properties',
  templateUrl: './favorites-properties.component.html',
  styleUrls: ['./favorites-properties.component.css']
})
export class FavoritesPropertiesComponent implements OnInit {
  propertiesDetails: PropertyDetails[];
  user : User;
  constructor(private readonly broadcastService: BroadcastService,
              private propertyService: PropertyService,
              private userService : UserService) { }

  ngOnInit(): void {
    this.user = this.userService.currentUserValue
    let propertiesIds = this.user.favoritesProperties.map(x => x.propertyId)
    this.propertyService.getPropertiesDetails(propertiesIds)
      .subscribe((data) => {
        this.propertiesDetails = data
        console.log(data)
      });
    this.broadcastService.subscribe('remove-from-favorites', id => {
      this.propertiesDetails = this.propertiesDetails.filter(x => x.id !== id)
      this.removeToFavorites(id)
    })
  }

  removeToFavorites(id:string){
    let favoritesProperties = this.userService.currentUserValue.favoritesProperties;
    favoritesProperties = favoritesProperties.filter(x=> x.propertyId !== id)
    this.userService.deleteFavoriteProperty(id);
  }
}
