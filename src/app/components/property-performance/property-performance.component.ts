import {
  AfterViewInit,
  Component, ElementRef,
  OnInit,
  Query,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {PropertyService} from "../../services/property.service";
import {UserService} from "../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {PropertyDetails} from "../../models/property-details";
import {FavoriteProperty} from "../../models/favorite-property";
import {BroadcastService} from "../../services/broadcast.service";
import {PropertyRatioPerformanceComponent} from "./property-ratio-performance/property-ratio-performance.component";

declare var H: any;

@Component({
  selector: 'app-property-performance-computing',
  templateUrl: './property-performance.component.html',
  styleUrls: ['./property-performance.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PropertyPerformanceComponent implements OnInit, AfterViewInit {

  @ViewChildren("map") public mapElement: QueryList<ElementRef>;

  public lat: any = '22.5726';
  public lng: any = '88.3639';

  public width: any = '600px';
  public height: any = '500px';

  private platform: any;
  private map: any;

  @ViewChildren(PropertyRatioPerformanceComponent) propertyRatio: QueryList<PropertyRatioPerformanceComponent>;

  public propertyDetails: PropertyDetails
  public depenses: Depense[] = []
  public libele_depense: string;
  public montant_depense: number;

  get total_depenses(): number {
    return this.depenses.length > 0 ? this.depenses.map(x => x.montant).reduce(this.calculTotal) : 0;
  }

  calculTotal(total, num) {
    return total + num;
  }

  constructor(private readonly route: ActivatedRoute,
              private propertyService: PropertyService,
              private userService: UserService,
              private broadcastService: BroadcastService) {
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const propertyId = Number(routeParams.get('propertyId'));
    this.propertyService.getPropertyDetails(propertyId)
      .subscribe((data) => {
        this.propertyDetails = data;
        this.getDepense()
        if (this.propertyDetails.taxesMunicipale) {
          this.depenses.push(new Depense('Taxes municipales', this.propertyDetails.taxesMunicipale, false))
        }
        if (this.propertyDetails.taxesScolaires) {
          this.depenses.push(new Depense('Taxes scolaires', this.propertyDetails.taxesScolaires, false))
        }
        console.log(data)
      });
    this.platform = new H.service.Platform({
      'apikey': 'fuYPnccj6wP-Bpj3fzLRqewjIs9BIuN6k_ScYPD-4Lk',
      useHTTPS: true
    });
  }

  addDepense() {
    if (this.libele_depense && this.montant_depense && !this.depenses.map(x => x.libele)
      .includes(this.libele_depense)) {
      this.depenses.push(new Depense(this.libele_depense, this.montant_depense));
      let depensesToSave = this.depensesToSave();
      this.userService.saveFavoriteProperty(new FavoriteProperty(this.propertyDetails.id, depensesToSave))
      this.broadcastService.broadcast('property-ratio-performance', {depenses: this.total_depenses})
    }
  }

  remove_depense(depense: Depense) {
    if (this.depenses.includes(depense)) {
      this.depenses = this.depenses.filter(x => x !== depense);
      this.userService.saveFavoriteProperty(new FavoriteProperty(this.propertyDetails.id, this.depensesToSave()))
      this.broadcastService.broadcast('property-ratio-performance', {depenses: this.total_depenses})
    }
  }

  depensesToSave() {
    return this.depenses
      .filter(x => x.can_be_delete)
      .reduce((x, v) => ({...x, [v.libele]: v.montant}), {});
  }

  getDepense() {
    let favorite = this.userService.currentUserValue.favoritesProperties.find(x => x.propertyId == this.propertyDetails.id)
    if (favorite && favorite.depenses) {
      let res = Object.keys(favorite.depenses).map((key) => new Depense(key, favorite.depenses[key]))
      res.forEach(x => {
        if (!this.depenses.map(d => d.libele)
          .includes(x.libele))
          this.depenses.push(x);
      })
    }
  }

  ngAfterViewInit(): void {
    this.propertyRatio.changes.subscribe(x => {
      console.log(x)
      this.broadcastService.broadcast('property-ratio-performance', {depenses: this.total_depenses})
    });

    this.mapElement.changes.subscribe(x=>{
      console.log(x)
      let pixelRatio = window.devicePixelRatio || 1;
      let defaultLayers = this.platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
      });
      this.map = new H.Map(x.first.nativeElement,
        defaultLayers.vector.normal.map, {
          zoom: 15,
          center: { lat: this.propertyDetails.latitude, lng: this.propertyDetails.longitude }
        });

      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
      var ui = H.ui.UI.createDefault(this.map, defaultLayers);
      // Define a variable holding SVG mark-up that defines an icon image:
      var svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="40px" viewBox="0 0 24 24" width="40px" fill="#000000"><g><rect fill="none" height="24" width="24" y="0"/></g><g><path d="M12,2c-4.2,0-8,3.22-8,8.2c0,3.18,2.45,6.92,7.34,11.23c0.38,0.33,0.95,0.33,1.33,0 C17.55,17.12,20,13.38,20,10.2C20,5.22,16.2,2,12,2z M12,12c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2 C14,11.1,13.1,12,12,12z" enable-background="new"/></g></svg>`;

      // Create an icon, an object holding the latitude and longitude, and a marker:
      var icon = new H.map.Icon(svgMarkup),
        coords = {lat: this.propertyDetails.latitude, lng: this.propertyDetails.longitude},
        marker = new H.map.Marker(coords, {icon: icon});
      this.map.addObject(marker);
    })
  }
}

class Depense {
  constructor(
    public libele: string,
    public montant: number,
    public can_be_delete: boolean = true) {
  }
}
