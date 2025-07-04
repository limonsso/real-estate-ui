import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Property } from '@models/app.models';
import { AppService } from '@services/app.service';
import { DomHandlerService } from '@services/dom-handler.service';
import { InputFileModule } from '../../../theme/components/input-file/input-file.module';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsModule } from '@angular/google-maps';
import { PipesModule } from '../../../theme/pipes/pipes.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
    selector: 'app-edit-property',
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatInputModule,
        MatSelectModule,
        InputFileModule,
        MatIconModule,
        GoogleMapsModule,
        PipesModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatButtonModule,
        FlexLayoutModule
    ],
    templateUrl: './edit-property.component.html',
    styleUrl: './edit-property.component.scss'
})
export class EditPropertyComponent implements OnInit {
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  private sub: any;
  public property: Property;
  public submitForm: FormGroup;
  public features: any[] = [];
  public propertyTypes: any[] = [];
  public propertyStatuses: any[] = [];
  public cities: any[] = [];
  public neighborhoods: any[] = [];
  public streets: any[] = [];
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12;
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    fullscreenControl: true
  }

  constructor(public appService: AppService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private ngZone: NgZone,
              private snackBar: MatSnackBar,
              private domHandlerService: DomHandlerService) { }

  ngOnInit() {
    this.features = this.appService.getFeatures();
    this.propertyTypes = this.appService.getPropertyTypes();
    this.propertyStatuses = this.appService.getPropertyStatuses();
    this.cities = this.appService.getCities();
    this.neighborhoods = this.appService.getNeighborhoods();
    this.streets = this.appService.getStreets();

    this.submitForm = this.fb.group({
      basic: this.fb.group({
        title: [null, Validators.required],
        desc: null,
        priceDollar: null,
        priceEuro: null,
        propertyType: [null, Validators.required],
        propertyStatus: null,
        gallery: null
      }),
      address: this.fb.group({
        location: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: '',
        neighborhood: '',
        street: ''
      }),
      additional: this.fb.group({
        bedrooms: '',
        bathrooms: '',
        garages: '',
        area: '',
        yearBuilt: '',
        features: this.buildFeatures()
      }),
      media: this.fb.group({
        videos: this.fb.array([this.createVideo()]),
        plans: this.fb.array([this.createPlan()]),
        additionalFeatures: this.fb.array([this.createFeature()]),
        featured: false
      })
    });

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.getPropertyById(params['id']);
    });

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public getPropertyById(id: any) {
    this.appService.getPropertyById(id).subscribe(data => {
      console.log(data)
      this.property = data;

      this.submitForm.controls.basic.get('title')!.setValue(this.property.title);
      this.submitForm.controls.basic.get('desc')!.setValue(this.property.desc);
      this.submitForm.controls.basic.get('priceDollar')!.setValue((this.property.priceDollar.sale) ? this.property.priceDollar.sale : this.property.priceDollar.rent);
      this.submitForm.controls.basic.get('priceEuro')!.setValue((this.property.priceEuro.sale) ? this.property.priceEuro.sale : this.property.priceEuro.rent);
      this.submitForm.controls.basic.get('propertyType')!.setValue(this.propertyTypes.filter(p => p.name == this.property.propertyType)[0]);

      const statusList: any[] = [];
      this.propertyStatuses.forEach(status => {
        this.property.propertyStatus.forEach(name => {
          if (status.name == name) {
            statusList.push(status);
          }
        })
      })
      this.submitForm.controls.basic.get('propertyStatus')!.setValue(statusList);

      const images: any[] = [];
      this.property.gallery.forEach(item => {
        let image = {
          link: item.medium,
          preview: item.medium
        }
        images.push(image);
      })
      this.submitForm.controls.basic.get('gallery')!.setValue(images);

      this.submitForm.controls.address.get('location')!.setValue(this.property.formattedAddress);
      this.lat = this.property.location.lat;
      this.lng = this.property.location.lng;
      this.getAddress();

      this.submitForm.controls.additional.get('bedrooms')!.setValue(this.property.bedrooms);
      this.submitForm.controls.additional.get('bathrooms')!.setValue(this.property.bathrooms);
      this.submitForm.controls.additional.get('garages')!.setValue(this.property.garages);
      this.submitForm.controls.additional.get('area')!.setValue(this.property.area.value);
      this.submitForm.controls.additional.get('yearBuilt')!.setValue(this.property.yearBuilt);
      this.features.forEach(feature => {
        this.property.features.forEach(name => {
          if (feature.name == name) {
            feature.selected = true;
          }
        })
      })
      this.submitForm.controls.additional.get('features')!.setValue(this.features);


      const videos = this.submitForm.controls.media.get('videos') as FormArray;
      while (videos.length) {
        videos.removeAt(0);
      }
      this.property.videos.forEach(video => videos.push(this.fb.group(video)));

      const plans = this.submitForm.controls.media.get('plans') as FormArray;
      while (plans.length) {
        plans.removeAt(0);
      }
      this.property.plans.forEach(plan => {
        let p = {
          id: plan.id,
          name: plan.name,
          desc: plan.desc,
          area: plan.area.value,
          rooms: plan.rooms,
          baths: plan.baths,
          image: null
        }
        plans.push(this.fb.group(p))
      });
      this.property.plans.forEach((plan, index) => {
        let image = {
          link: plan.image,
          preview: plan.image
        }
        this.submitForm.controls.media.get('plans')!['controls'][index].controls.image.setValue([image]);
      })

      const additionalFeatures = this.submitForm.controls.media.get('additionalFeatures') as FormArray;
      while (additionalFeatures.length) {
        additionalFeatures.removeAt(0);
      }
      this.property.additionalFeatures.forEach(feature => additionalFeatures.push(this.fb.group(feature)));

      this.submitForm.controls.media.get('featured')!.setValue(this.property.featured);

    });
  }




  // -------------------- Address ---------------------------  
  public onSelectCity() {
    this.submitForm.controls.address.get('neighborhood')!.setValue(null, { emitEvent: false });
    this.submitForm.controls.address.get('street')!.setValue(null, { emitEvent: false });
  }
  public onSelectNeighborhood() {
    this.submitForm.controls.address.get('street')!.setValue(null, { emitEvent: false });
  }

  private setCurrentPosition() {
    if (this.domHandlerService.isBrowser) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });
      }
    }
  }

  onMapReady() {
    setTimeout(() => {
      this.placesAutocomplete();
    });
  }

  private placesAutocomplete() {
    let autocomplete = new google.maps.places.Autocomplete(this.addressAutocomplete.nativeElement, {
      types: ["address"]
    });
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        if (place.geometry === undefined || place.geometry === null) {
          return;
        };
        this.lat = place.geometry.location!.lat();
        this.lng = place.geometry.location!.lng();
        this.getAddress();
      });
    });
  }

  public getAddress() {
    this.appService.getAddress(this.lat, this.lng).subscribe(response => {
      if (response['results'][0]) {
        let address = response['results'][0].formatted_address;
        this.submitForm.controls.address.get('location')!.setValue(address);
        this.setAddresses(response['results'][0]);
      }
    })
  }

  public onMapClick(e: any) {
    this.lat = e.latLng.lat();
    this.lng = e.latLng.lng();
    this.getAddress();
  }

  public setAddresses(result) {
    this.submitForm.controls.address.get('city')!.setValue(null);
    this.submitForm.controls.address.get('zipCode')!.setValue(null);
    this.submitForm.controls.address.get('street')!.setValue(null);

    var newCity, newStreet, newNeighborhood;

    result.address_components.forEach(item => {
      if (item.types.indexOf('locality') > -1) {
        if (this.cities.filter(city => city.name == item.long_name)[0]) {
          newCity = this.cities.filter(city => city.name == item.long_name)[0];
        }
        else {
          newCity = { id: this.cities.length + 1, name: item.long_name };
          this.cities.push(newCity);
        }
        this.submitForm.controls.address.get('city')!.setValue(newCity);
      }
      if (item.types.indexOf('postal_code') > -1) {
        this.submitForm.controls.address.get('zipCode')!.setValue(item.long_name);
      }
    });

    if (!newCity) {
      result.address_components.forEach(item => {
        if (item.types.indexOf('administrative_area_level_1') > -1) {
          if (this.cities.filter(city => city.name == item.long_name)[0]) {
            newCity = this.cities.filter(city => city.name == item.long_name)[0];
          }
          else {
            newCity = {
              id: this.cities.length + 1,
              name: item.long_name
            };
            this.cities.push(newCity);
          }
          this.submitForm.controls.address.get('city')!.setValue(newCity);
        }
      });
    }

    if (newCity) {
      result.address_components.forEach(item => {
        if (item.types.indexOf('neighborhood') > -1) {
          let neighborhood = this.neighborhoods.filter(n => n.name == item.long_name && n.cityId == newCity.id)[0];
          if (neighborhood) {
            newNeighborhood = neighborhood;
          }
          else {
            newNeighborhood = {
              id: this.neighborhoods.length + 1,
              name: item.long_name,
              cityId: newCity.id
            };
            this.neighborhoods.push(newNeighborhood);
          }
          this.neighborhoods = [...this.neighborhoods];
          this.submitForm.controls.address.get('neighborhood')!.setValue([newNeighborhood]);
        }
      })
    }

    if (newCity) {
      result.address_components.forEach(item => {
        if (item.types.indexOf('route') > -1) {
          if (this.streets.filter(street => street.name == item.long_name && street.cityId == newCity.id)[0]) {
            newStreet = this.streets.filter(street => street.name == item.long_name && street.cityId == newCity.id)[0];
          }
          else {
            newStreet = {
              id: this.streets.length + 1,
              name: item.long_name,
              cityId: newCity.id,
              neighborhoodId: (newNeighborhood) ? newNeighborhood.id : null
            };
            this.streets.push(newStreet);
          }
          this.streets = [...this.streets];
          this.submitForm.controls.address.get('street')!.setValue([newStreet]);
        }
      })
    }

  }


  // -------------------- Additional ---------------------------  
  public buildFeatures() {
    const arr = this.features.map(feature => {
      return this.fb.group({
        id: feature.id,
        name: feature.name,
        selected: feature.selected
      });
    })
    return this.fb.array(arr);
  }



  // -------------------- Media --------------------------- 
  public createVideo(): FormGroup {
    return this.fb.group({
      id: null,
      name: null,
      link: null
    });
  }
  public addVideo(): void {
    const videos = this.submitForm.controls.media.get('videos') as FormArray;
    videos.push(this.createVideo());
  }
  public deleteVideo(index) {
    const videos = this.submitForm.controls.media.get('videos') as FormArray;
    videos.removeAt(index);
  }

  public createPlan(): FormGroup {
    return this.fb.group({
      id: null,
      name: null,
      desc: null,
      area: null,
      rooms: null,
      baths: null,
      image: null
    });
  }
  public addPlan(): void {
    const plans = this.submitForm.controls.media.get('plans') as FormArray;
    plans.push(this.createPlan());
  }
  public deletePlan(index) {
    const plans = this.submitForm.controls.media.get('plans') as FormArray;
    plans.removeAt(index);
  }


  public createFeature(): FormGroup {
    return this.fb.group({
      id: null,
      name: null,
      value: null
    });
  }
  public addFeature(): void {
    const features = this.submitForm.controls.media.get('additionalFeatures') as FormArray;
    features.push(this.createFeature());
  }
  public deleteFeature(index) {
    const features = this.submitForm.controls.media.get('additionalFeatures') as FormArray;
    features.removeAt(index);
  }



  public step = 0;
  setStep(index: number) {
    this.step = index;
  }
  onSubmitForm(form) {
    if (this.submitForm.get(form)!.valid) {
      this.nextStep();
      if (form == "media") {
        this.snackBar.open('The property "' + this.property.title + '" has been updated.', '×', {
          verticalPosition: 'top',
          duration: 5000
        });
      }
    }
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }


  get featuresForm() { 
    return (this.submitForm.get('additional') as FormGroup).controls.features as FormArray 
  }

}
