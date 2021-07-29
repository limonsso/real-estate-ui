import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {PropertySummary} from "../../models/property-summary";
import {BroadcastService} from "../../services/broadcast.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css']
})
export class PropertiesListComponent implements OnInit, AfterViewInit {

  public properties!: PropertySummary[];
  constructor(private readonly broadcastService:BroadcastService) { }

  ngOnInit(): void {
    this.broadcastService.subscribe('properties-summary', payload => {
      console.log(payload)
      this.properties = payload;
    })
  }

  ngAfterViewInit(): void {

  }

}
