import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LocalStorageService} from 'angular-web-storage';
import {BroadcastService} from 'src/app/services/broadcast.service';
import {PropertyService} from 'src/app/services/property.service';
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-properties-list-pagination',
  templateUrl: './properties-list-pagination.component.html',
  styleUrls: ['./properties-list-pagination.component.css']
})
export class PropertiesListPaginationComponent implements OnInit, AfterViewInit {


  public totalPages: number;

  public localitySelected: string[] = [];
  public pageSize: number = 8;
  public currentPage: number;
  public first: number;
  public second: number;
  public third: number;

  constructor(private readonly propertyService: PropertyService,
              private readonly broacastService: BroadcastService,
              private readonly userService: UserService,
              private readonly localStorage: LocalStorageService) {
  }

  ngOnInit() {
    this.broacastService.subscribe('properties-list-pagination', data => {
      this.totalPages = data.totalPage;
      this.localitySelected = data.localitySelected;
      let search_localStorage = this.localStorage.get("search");
      if (search_localStorage) {
        this.currentPage = search_localStorage.page;
        this.setBoxPagination()
      }
    })
  }

  onPaginateChange(pageNumber: number, setBox: boolean = false) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.propertyService.getPropertiesListByLocalitiesWithPaging(this.localitySelected, pageNumber, this.pageSize)
        .subscribe((data) => {
          console.log(data);
          this.localStorage.set("search", {page: pageNumber})
          this.broacastService.broadcast('properties-summary', data.properties);
          if (setBox) {
            this.setBoxPagination();
          }
        });
    }
  }

  public setBoxPagination() {
    this.first = this.currentPage < this.totalPages - 2 ? this.currentPage : this.totalPages - 2;
    this.second = this.first + 1;
    this.third = this.second + 1;
  }

  ngAfterViewInit(): void {

  }

}
