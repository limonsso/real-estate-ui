import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {PropertyDetails} from "../../models/property-details";
import {MortgageCalculatorService} from "../../services/mortgage-calculator.service";
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {BroadcastService} from "../../services/broadcast.service";
import {Frequency} from "../../models/Frequences";

@Component({
  selector: 'app-favorites-properties-item',
  templateUrl: './favorites-properties-item.component.html',
  styleUrls: ['./favorites-properties-item.component.css']
})
export class FavoritesPropertiesItemComponent implements OnInit, AfterViewInit {
  @Input()
  propertyDetails: PropertyDetails
  public versement: Observable<number>;
  public amortissement: number = 25;
  public interet: number = 4;
  public rno: Observable<number>;
  public mrb: Observable<number>;
  public mrn: Observable<number>
  public mise_de_fond: number;

  constructor(private readonly broadcastService: BroadcastService, private readonly mortgageCalculatorService: MortgageCalculatorService, private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.mortgageCalculatorService.calculate_montant_versement(+this.propertyDetails.price, this.amortissement, this.interet / 100, Frequency.MONTHLY)
      .subscribe(data => {
        this.versement = of(data);
      })
    this.mortgageCalculatorService.calculate_montant_rno(+this.propertyDetails.price,0)
      .subscribe(data => {
        this.rno = of(data);

        this.mortgageCalculatorService.calculate_montant_mrn(+this.propertyDetails.price, data)
          .subscribe(data => {
            this.mrn = of(data);
          })
      })

  }

  redirectToDetail() {
    this.router.navigate([`/property-details/${this.propertyDetails.id}`])
  }

  removeToFavorites() {
    this.broadcastService.broadcast("remove-from-favorites", this.propertyDetails.id)
  }

  redirectToCalulator() {
    this.router.navigate([`/property-performance/${this.propertyDetails.id}`])
  }
}
