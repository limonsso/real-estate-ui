import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartType, ChartOptions, } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsTooltip,
  monkeyPatchChartJsLegend,
  BaseChartDirective
} from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BroadcastService } from "../../../services/broadcast.service";
import { Observable, of } from "rxjs";
import { MortgageCalculatorService } from "../../../services/mortgage-calculator.service";
import { formatCurrency } from "@angular/common";
import { Frequences } from "../../../models/Frequences";

@Component({
  selector: 'app-property-ratio-performance',
  templateUrl: './property-ratio-performance.component.html',
  styleUrls: ['./property-ratio-performance.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PropertyRatioPerformanceComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  @Input()
  public Price: number
  @Input()
  public RevenuPotentielAnnuel: number
  public DepensesConnues: number
  public RNO: Observable<number>

  public chartColors: Array<any> = [
    { // all colors in order
      backgroundColor: ['#70c966', '#6fabea', '#f67676']
    }
  ]
  public pieChartLabels: Label[] = ['Cash flow', 'Dépenses connues'];
  public pieChartData: SingleDataSet = [0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [ChartDataLabels];
  public MRN: Observable<number> = of(0);
  public MRN_date: Observable<any> = of(0);
  public frequencies: Frequences = new Frequences();
  public montant_versement: number = 0;
  public versement_frequency: number = 0
  selectedFrequency: number = 1;


  constructor(private broadcastService: BroadcastService, private mortgageCalculatorService: MortgageCalculatorService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.broadcastService.subscribe('property-montant-versement', data => {
      this.montant_versement = data.montant_versement;
      this.versement_frequency = data.frequence;
      if (!this.pieChartLabels.includes('hypothèque')) {
        this.pieChartLabels.push('hypothèque')
        this.pieChartData.push(+((data.montant_versement * data.frequence) / this.selectedFrequency).toFixed(2));
      } else {
        this.pieChartData[this.pieChartData.length - 1] = +((data.montant_versement * data.frequence) / this.selectedFrequency).toFixed(2);
      }
      this.pieChartData[0] = +((this.RevenuPotentielAnnuel - this.DepensesConnues - (this.montant_versement * this.versement_frequency)) / this.selectedFrequency).toFixed(2);
      this.chart.chart.update()
      this.Price = data.montant_pret;
      this.initialize_ratio_evaluation_multilo();
    })
    this.broadcastService.subscribe('property-ratio-performance', data => {
      this.DepensesConnues = data.depenses;
      this.RNO = of(this.RevenuPotentielAnnuel - data.depenses);
      this.initialize_ratio_evaluation_multilo();
      this.pieChartData[0] = (this.RevenuPotentielAnnuel - data.depenses - (this.montant_versement * this.versement_frequency)) / this.selectedFrequency;
      this.pieChartData[1] = (data.depenses) / this.selectedFrequency;
      this.chart.chart.update()
    })
  }

  initialize_ratio_evaluation_multilo() {
    this.RNO.subscribe(data => {
      this.mortgageCalculatorService.calculate_montant_mrn(this.Price, data)
        .subscribe(data => {
          let value = +(data).toFixed(2);
          this.MRN = of(value);
          var y = Math.floor(value);            // whole years
          var m = Math.floor(12 * (value - y)); // treat remainder as fraction of a year
          this.MRN_date = of(`${y}ans ${m}mois`);
        })
    })
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',

    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          const montant = ctx.chart.data.datasets[0].data[ctx.dataIndex];
          return +montant < 0 ? `(${formatCurrency(+montant * -1, 'fr-ca', '$')})` : `${formatCurrency(+montant, 'fr-ca', '$')}`;
        },
        font: {
          weight: 'bold',
          size: 14
        },
        color: (ctx) => {
          const montant = ctx.chart.data.datasets[0].data[ctx.dataIndex];
          return +montant < 0 ? `#c90e00` : `black`;
        }
      },
    }
  };

  selectChangeFrequency() {
    this.pieChartData[0] = (this.RevenuPotentielAnnuel - this.DepensesConnues - (this.montant_versement * this.versement_frequency)) / this.selectedFrequency;
    this.pieChartData[1] = (this.DepensesConnues) / this.selectedFrequency;
    this.pieChartData[2] = (this.montant_versement * this.versement_frequency) / this.selectedFrequency;
    this.chart.chart.update()
  }
}

