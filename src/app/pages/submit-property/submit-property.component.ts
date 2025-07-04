import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { AppService } from '@services/app.service';
import { DomHandlerService } from '@services/dom-handler.service';
import { InputFileModule } from '../../theme/components/input-file/input-file.module';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsModule } from '@angular/google-maps';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-submit-property',
    imports: [
        ReactiveFormsModule,
        FlexLayoutModule,
        MatStepperModule,
        MatInputModule,
        MatSelectModule,
        InputFileModule,
        MatIconModule,
        GoogleMapsModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        PipesModule
    ],
    templateUrl: './submit-property.component.html'
})
export class SubmitPropertyComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  public submitForm: FormGroup;
  public features: any[] = [];
  public propertyTypes: any[] = [];
  public propertyStatuses: any[] = [];
  public cities: any[] = [];
  public neighborhoods: any[] = [];
  public streets: any[] = [];
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  center: google.maps.LatLngLiteral = { lat: 40.678178, lng: -73.944158 };
  zoom: number = 12;
  markerPositions: google.maps.LatLngLiteral[] = [
    { lat: 40.678178, lng: -73.944158 }
  ];
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    fullscreenControl: true
  }

  constructor(public appService: AppService,
              private fb: FormBuilder,
              private ngZone: NgZone,
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

    this.setCurrentPosition();
  }

  public onSelectionChange(e: any) {
    if (e.selectedIndex == 4) {
      this.horizontalStepper._steps.forEach(step => step.editable = false);
      console.log(this.submitForm.value);
    }
  }
  public reset() {
    this.horizontalStepper.reset();

    const videos = <FormArray>this.submitForm.controls.media.get('videos');
    while (videos.length > 1) {
      videos.removeAt(0)
    }
    const plans = <FormArray>this.submitForm.controls.media.get('plans');
    while (plans.length > 1) {
      plans.removeAt(0)
    }
    const additionalFeatures = <FormArray>this.submitForm.controls.media.get('additionalFeatures');
    while (additionalFeatures.length > 1) {
      additionalFeatures.removeAt(0)
    }

    this.submitForm.reset({
      additional: {
        features: this.features
      },
      media: {
        featured: false
      }
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
          this.center = {
            lat: this.lat,
            lng: this.lng
          }
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
        this.center = {
          lat: this.lat,
          lng: this.lng
        }
        this.getAddress();
      });
    });
  }

  // public getAddress(){     
  //   let geocoder = new google.maps.Geocoder();
  //   let latlng = new google.maps.LatLng(this.lat, this.lng); 
  //   geocoder.geocode({'location': latlng}, (results, status) => {
  //     if(status === google.maps.GeocoderStatus.OK) {
  //       console.log(results);   
  //       let address = results[0].formatted_address; 
  //       this.submitForm.controls.address.get('location').setValue(address); 
  //       this.setAddresses(results[0]);          
  //     }
  //   }); 
  // }
  public getAddress() {
    this.appService.getAddress(this.lat, this.lng).subscribe(response => {
      console.log(response);
      if (response['results'].length) {
        if (response['results'][0]) {
          let address = response['results'][0].formatted_address;
          this.submitForm.controls.address.get('location')!.setValue(address);
          this.setAddresses(response['results'][0]);
        }
      }
    })
  }
  public onMapClick(e: any) {
    this.lat = e.latLng.lat();
    this.lng = e.latLng.lng();
    this.getAddress();
  }

  public setAddresses(result: any) {
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

  get featuresForm() { 
    return (this.submitForm.get('additional') as FormGroup).controls.features as FormArray 
  }

}