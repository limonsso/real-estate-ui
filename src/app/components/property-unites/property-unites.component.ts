import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-property-unites',
  templateUrl: './property-unites.component.html',
  styleUrls: ['./property-unites.component.css']
})
export class PropertyUnitesComponent implements OnInit {

  @Input()
  public property_unites!: any

  constructor() {
  }

  ngOnInit(): void {
  }

}
