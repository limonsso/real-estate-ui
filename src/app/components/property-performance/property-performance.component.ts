import {
  AfterViewInit,
  Component, ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { PropertyService } from "../../services/property.service";
import { UserService } from "../../services/user.service";
import { ActivatedRoute } from "@angular/router";
import { PropertyDetails } from "../../models/property-details";
import { FavoriteProperty } from "../../models/favorite-property";
import { BroadcastService } from "../../services/broadcast.service";
import { PropertyRatioPerformanceComponent } from "./property-ratio-performance/property-ratio-performance.component";
import { PropertyMapInfo } from 'src/app/models/property-map-info';

declare var H: any;

@Component({
  selector: 'app-property-performance-computing',
  templateUrl: './property-performance.component.html',
  styleUrls: ['./property-performance.component.css'],
})
export class PropertyPerformanceComponent implements OnInit, AfterViewInit {

  @ViewChildren("map") public mapElement: QueryList<any>;

  public width: any = '600px';
  public height: any = '500px';

  private platform: any;
  private map: any;

  @ViewChildren(PropertyRatioPerformanceComponent) propertyRatio: QueryList<PropertyRatioPerformanceComponent>;

  public propertyDetails: PropertyDetails
  public depenses: Depense[] = []
  public libele_depense: string;
  public montant_depense: number;
  public mapInfos: PropertyMapInfo[];

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
        var propDetails = [...[data], ...data.nearProperties]
        this.mapInfos = this.getMapInfosProperties(propDetails);

        this.getDepense()
        if (this.propertyDetails.taxesMunicipale) {
          this.depenses.push(new Depense('Taxes municipales', this.propertyDetails.taxesMunicipale, false))
        }
        if (this.propertyDetails.taxesScolaires) {
          this.depenses.push(new Depense('Taxes scolaires', this.propertyDetails.taxesScolaires, false))
        }
        console.log(data)
      });
  }

  addDepense() {
    if (this.libele_depense && this.montant_depense && !this.depenses.map(x => x.libele)
      .includes(this.libele_depense)) {
      this.depenses.push(new Depense(this.libele_depense, this.montant_depense));
      let depensesToSave = this.depensesToSave();
      this.userService.saveFavoriteProperty(new FavoriteProperty(this.propertyDetails.id, depensesToSave))
      this.broadcastService.broadcast('property-ratio-performance', { depenses: this.total_depenses })
    }
  }

  removeDepense(depense: Depense) {
    if (this.depenses.includes(depense)) {
      this.depenses = this.depenses.filter(x => x !== depense);
      this.userService.saveFavoriteProperty(new FavoriteProperty(this.propertyDetails.id, this.depensesToSave()))
      this.broadcastService.broadcast('property-ratio-performance', { depenses: this.total_depenses })
    }
  }

  depensesToSave() {
    return this.depenses
      .filter(x => x.can_be_delete)
      .reduce((x, v) => ({ ...x, [v.libele]: v.montant }), {});
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
      this.broadcastService.broadcast('property-ratio-performance', { depenses: this.total_depenses })
    });
  }

  getMapInfosProperties(data: PropertyDetails[]): PropertyMapInfo[] {
    return data.map((p, i) => new PropertyMapInfo(p.id,
      p.type,
      p.vendue,
      p.price,
      p.street, i === 0, p.longitude, p.latitude)
    );
  }

}

class Depense {
  constructor(
    public libele: string,
    public montant: number,
    public can_be_delete: boolean = true) {
  }
}
