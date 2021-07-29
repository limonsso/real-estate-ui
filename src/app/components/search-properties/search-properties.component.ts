import {Component, OnInit} from '@angular/core';
import {PropertyService} from "../../services/property.service";
import {BroadcastService} from "../../services/broadcast.service";
import {range} from "lodash";
import {PageEvent} from "@angular/material/paginator";
import {select, Store} from "@ngrx/store";
import {UpdateStore} from "../../store/actions/localities-store.actions";
import {LocalitiesState} from "../../store/reducers/localities-strore.reducer";
import {UserService} from "../../services/user.service";
import {AppState} from "../../app-state";


@Component({
  selector: 'app-search-properties',
  templateUrl: './search-properties.component.html',
  styleUrls: ['./search-properties.component.css']
})
export class SearchPropertiesComponent implements OnInit {

  public localities: string[] = [];
  public localitySelected: string[] = [];
  public totalPages: number = 1;
  public pageSize: number = 12;
  public pageSizeOptions: number[] = [];
  public countProperties: number = 0;
  pageEvent!: PageEvent;

  constructor(private readonly propertyService: PropertyService,
              private readonly broacastService: BroadcastService,
              private readonly userService: UserService,
              private localitiesSelectedStore: Store<AppState>) {
  }

  ngOnInit(): void {
    this.propertyService.getLocalities().subscribe((data) => {
      this.localities = data;
    });
    this.localitiesSelectedStore.subscribe((state)=>{
      console.log(state)
    })
  }

  search(paging: number = 1) {
    this.propertyService.getPropertiesListByLocalitiesWithPaging(this.localitySelected, paging, this.pageSize)
      .subscribe((data) => {
        this.broacastService.boradcast('properties-summary', data.properties)
        this.totalPages = data.totalPage;
        this.pageSizeOptions = range(1, data.totalPage, this.pageSize)
      });
  }

  onPaginateChange($event: PageEvent) {
    this.propertyService.getPropertiesListByLocalitiesWithPaging(this.localitySelected, $event.pageIndex + 1, this.pageSize)
      .subscribe((data) => {
        console.log(data);
        this.broacastService.boradcast('properties-summary', data.properties)
        this.totalPages = data.totalPage;
      });
  }

  selectLocalities($event: any) {
    this.userService.updateLocalitiesSearched($event)
      .subscribe((data) => {
        this.localitiesSelectedStore.dispatch(UpdateStore({payload:data}));
    });
  }
}
