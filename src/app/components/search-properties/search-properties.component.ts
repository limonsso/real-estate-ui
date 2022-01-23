import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PropertyService } from "../../services/property.service";
import { BroadcastService } from "../../services/broadcast.service";
import { range } from "lodash";
import { PageEvent } from "@angular/material/paginator";
import { UserService } from "../../services/user.service";
import { Observable, of } from "rxjs";
import { LocalStorageService } from "angular-web-storage";


@Component({
  selector: 'app-search-properties',
  templateUrl: './search-properties.component.html',
  styleUrls: ['./search-properties.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchPropertiesComponent implements OnInit, AfterViewInit {
  @ViewChild('ngselectlocalities') ngselectlocalities;
  @ViewChild('paginator') paginator;
  public localities$ = new Observable<string[]>();
  public localitySelected: string[] = [];
  public totalPages: number;
  public pageSize: number = 8;
  public pageSizeOptions: number[] = [];
  public countProperties: number = 0;
  pageEvent!: PageEvent;

  constructor(private readonly propertyService: PropertyService,
    private readonly broacastService: BroadcastService,
    private readonly userService: UserService,
    private readonly localStorage: LocalStorageService) {
  }

  ngOnInit(): void {
    this.propertyService.getLocalities().subscribe((data) => {
      this.localities$ = of(data);
      this.userService.currentUser.subscribe(user => {
        if (user !== null) {
          console.log(user);
          this.localitySelected = user.localitiesSelectedLastSearch;
          var search_localStorage = this.localStorage.get("search");
          if (search_localStorage) {
            var page = search_localStorage.page
            this.search(page);
          }
        }
      })
    });
  }

  search(paging: number = 1) {
    this.propertyService.getPropertiesListByLocalitiesWithPaging(this.localitySelected, paging, this.pageSize)
      .subscribe((data) => {
        this.localStorage.set("search", { page: paging })
        this.broacastService.broadcast('properties-summary', data.properties)
        this.totalPages = data.totalPage;
        this.broacastService.broadcast('properties-list-pagination',
          { totalPage: data.totalPage, localitySelected: this.localitySelected })
        this.pageSizeOptions = range(1, data.totalPage, this.pageSize)
      });
  }

  selectLocalities() {
    this.userService.updateLocalitiesSearched(this.localitySelected);
  }

  ngAfterViewInit(): void {
  }

}
