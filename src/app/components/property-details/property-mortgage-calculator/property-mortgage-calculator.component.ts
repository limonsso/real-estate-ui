import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MortgageCalculatorService} from "../../../services/mortgage-calculator.service";
import {Observable, of} from "rxjs";
import {BroadcastService} from "../../../services/broadcast.service";

@Component({
  selector: 'app-property-mortgage-calculator',
  templateUrl: './property-mortgage-calculator.component.html',
  styleUrls: ['./property-mortgage-calculator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PropertyMortgageCalculatorComponent implements OnInit, AfterViewInit {
  @Input() hypotheque:number;

  public amortissement:number=25;
  public interet:number=4;
  public mise_de_fond: number;
  public montant: Observable<number>;

  constructor(private readonly mortgageCalculatorService: MortgageCalculatorService,
              private readonly broadcastService: BroadcastService) { }

  ngOnInit(): void {
    this.calculate()
  }

  calculate() {
    if(this.mise_de_fond){
      this.hypotheque = this.hypotheque - this.mise_de_fond;
    }
    this.mortgageCalculatorService.calculate_montant_versement(this.hypotheque,this.amortissement,this.interet/100)
      .subscribe(data=>{
        this.montant = of(data);
      })
  }
  mise_de_fond_in_percent(){
    if(this.mise_de_fond){
      return ((this.mise_de_fond/this.hypotheque) * 100).toFixed(2)
    }
    return 0
  }

  ngAfterViewInit(): void {

  }

}
