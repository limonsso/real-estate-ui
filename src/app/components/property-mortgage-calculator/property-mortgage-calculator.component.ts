import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MortgageCalculatorService} from "../../services/mortgage-calculator.service";
import {Observable, of} from "rxjs";
import {BroadcastService} from "../../services/broadcast.service";
import {Frequences} from "../../models/Frequences";

@Component({
  selector: 'app-property-mortgage-calculator',
  templateUrl: './property-mortgage-calculator.component.html',
  styleUrls: ['./property-mortgage-calculator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PropertyMortgageCalculatorComponent implements OnInit, AfterViewInit {
  @Input() Price: number;

  public hypotheque: number;
  public amortissement: number = 25;
  public interet: number = 4;
  public mise_de_fond: number;
  public mise_de_fond_percent: number = 0.15;
  public montant: Observable<number>;
  selectedFrequency: number=12;
  frequencies: Frequences = new Frequences();

  constructor(private readonly mortgageCalculatorService: MortgageCalculatorService,
              private readonly broadcastService: BroadcastService) {
  }

  ngOnInit(): void {
    this.mise_de_fond = this.Price * this.mise_de_fond_percent
    this.hypotheque = this.Price - this.mise_de_fond
    this.calculate()
  }

  calculate() {
    this.mortgageCalculatorService.calculate_montant_versement(this.hypotheque, this.amortissement, this.interet / 100, this.selectedFrequency)
      .subscribe(data => {
        this.montant = of(data);
        this.broadcastService.broadcast('property-montant-versement',
          {montant_versement:data,
            frequence:this.selectedFrequency
        })
      })
  }

  ngAfterViewInit(): void {

  }

  update_mise_de_fond_percent(event) {
    this.mise_de_fond = event;
    this.hypotheque = this.Price -this.mise_de_fond
    this.mise_de_fond_percent = (this.mise_de_fond / this.Price)
  }
}
