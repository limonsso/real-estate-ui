import {Component, Input, OnInit} from '@angular/core';
import {PropertySummary} from "../../models/property-summary";
import {BroadcastService} from "../../services/broadcast.service";
import {Router} from "@angular/router";
import {property} from "lodash";

@Component({
  selector: 'app-properties-list-item',
  templateUrl: './properties-list-item.component.html',
  styleUrls: ['./properties-list-item.component.scss']
})
export class PropertiesListItemComponent implements OnInit {

  @Input() property!: PropertySummary;
  constructor(private readonly router: Router, private  readonly  broadcastService: BroadcastService) { }

  ngOnInit(): void {
  }

  redirectToDetail(id: string) {
    this.router.navigate([`/property-details/${id}`])
  }
}
