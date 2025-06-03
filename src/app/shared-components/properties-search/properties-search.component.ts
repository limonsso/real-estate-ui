import { NgClass } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '@services/app.service';
import { ApiService } from '@services/api.service';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { PropertyType } from '../../common/interfaces/property-type.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-properties-search',
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    NgClass,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslateModule,
    PipesModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './properties-search.component.html',
  styleUrls: ['./properties-search.component.scss']
})
export class PropertiesSearchComponent implements OnInit {
  @Input() variant: number = 1;
  @Input() vertical: boolean = false;
  @Input() searchOnBtnClick: boolean = false;
  @Input() removedSearchField: string;
  @Output() searchChange = new EventEmitter<FormGroup>();
  @Output() searchClick = new EventEmitter<FormGroup>();
  public showMore: boolean = false;
  public propertyTypes: PropertyType[] = [];
  public propertyStatuses: any[] = [];
  public cities: any[] = [];
  public neighborhoods: any[] = [];
  public streets: any[] = [];
  public features: any[] = [];
  public isLoading: boolean = false;

  searchForm: FormGroup;

  // Alias pour la compatibilité avec le template
  get form() { return this.searchForm; }

  constructor(
    public appService: AppService,
    private apiService: ApiService,
    public fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit() {
    if (this.vertical) {
      this.showMore = true;
    }
    this.loadPropertyTypes();
    this.propertyStatuses = this.appService.getPropertyStatuses();
    this.cities = this.appService.getCities();
    this.neighborhoods = this.appService.getNeighborhoods();
    this.streets = this.appService.getStreets();
    this.features = this.appService.getFeatures();
  }

  private loadPropertyTypes() {
    this.isLoading = true;
    this.apiService.getPropertyTypes().subscribe({
      next: (types) => {
        this.propertyTypes = types;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types de propriétés:', error);
        this.propertyTypes = this.apiService.getStaticPropertyTypes();
        this.isLoading = false;
      }
    });
  }

  private initForm() {
    this.searchForm = this.fb.group({
      propertyType: [''],
      status: [''],
      priceMin: [''],
      priceMax: [''],
      city: [''],
      zipCode: [''],
      neighborhood: [''],
      street: [''],
      bedrooms: [''],
      bathrooms: [''],
      garages: [''],
      area: [''],
      yearBuilt: [''],
      features: [[]]
    });
  }

  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf(".") > -1) {
        let arr = this.removedSearchField.split(".");
        this.searchForm.controls[arr[0]]['controls'][arr[1]].reset();
      }
      else if (this.removedSearchField.indexOf(",") > -1) {
        let arr = this.removedSearchField.split(",");
        this.searchForm.controls[arr[0]]['controls'][arr[1]]['controls']['selected'].setValue(false);
      }
      else {
        this.searchForm.controls[this.removedSearchField].reset();
      }
    }
  }

  public resetForm() {
    this.searchForm.reset();
    this.onSearchChange();
  }

  public onSearchChange() {
    this.searchChange.emit(this.searchForm);
  }

  public onSearchClick() {
    this.searchClick.emit(this.searchForm);
  }

  public onSelectCity() {
    this.searchForm.controls['neighborhood'].setValue(null, { emitEvent: false });
    this.searchForm.controls['street'].setValue(null, { emitEvent: false });
  }
  public onSelectNeighborhood() {
    this.searchForm.controls['street'].setValue(null, { emitEvent: false });
  }

  public getAppearance(): MatFormFieldAppearance {
    return (this.variant !== 3) ? 'outline' : 'fill';
  }
  public getFloatLabel(): FloatLabelType {
    return (this.variant === 1) ? 'always' : 'auto';
  }

  search() {
    this.onSearchClick();
  }

  // Alias pour la compatibilité avec le template
  get reset() { return this.resetForm; }
}
