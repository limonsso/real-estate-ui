import { FormGroup } from '@angular/forms';
import { PropertySearchModel } from '../interfaces/property-search.interface';

export class PropertySearchMapper {
    public static mapFormToSearchModel(form: FormGroup): PropertySearchModel {
        const formValue = form.value;
        const searchModel: PropertySearchModel = {};

        // Type de propriété
        if (formValue.propertyType) {
            searchModel.type = formValue.propertyType;
        }

        // Prix
        if (formValue.price?.from) {
            searchModel.minPrice = Number(formValue.price.from);
        }
        if (formValue.price?.to) {
            searchModel.maxPrice = Number(formValue.price.to);
        }

        // Ville et région
        if (formValue.city) {
            searchModel.city = formValue.city;
        }
        if (formValue.zipCode) {
            searchModel.region = formValue.zipCode;
        }

        // Année de construction
        if (formValue.yearBuilt?.from) {
            searchModel.minConstructionYear = Number(formValue.yearBuilt.from);
        }
        if (formValue.yearBuilt?.to) {
            searchModel.maxConstructionYear = Number(formValue.yearBuilt.to);
        }

        // Surface
        if (formValue.area?.from) {
            searchModel.minSurface = Number(formValue.area.from);
        }
        if (formValue.area?.to) {
            searchModel.maxSurface = Number(formValue.area.to);
        }

        // Chambres
        if (formValue.bedrooms?.from) {
            searchModel.minBedrooms = Number(formValue.bedrooms.from);
        }
        if (formValue.bedrooms?.to) {
            searchModel.maxBedrooms = Number(formValue.bedrooms.to);
        }

        // Salles de bain
        if (formValue.bathrooms?.from) {
            searchModel.minBathrooms = Number(formValue.bathrooms.from);
        }
        if (formValue.bathrooms?.to) {
            searchModel.maxBathrooms = Number(formValue.bathrooms.to);
        }

        // Places de parking
        if (formValue.garages?.from) {
            searchModel.minParkingSpaces = Number(formValue.garages.from);
        }

        // Features sélectionnées
        const selectedFeatures = formValue.features
            ?.filter((f: any) => f.selected)
            ?.map((f: any) => f.name);

        if (selectedFeatures?.length) {
            // Si "Indoor Parking" est sélectionné
            if (selectedFeatures.includes('Indoor Parking')) {
                searchModel.hasIndoorParking = true;
            }
            // Si "Outdoor Parking" est sélectionné
            if (selectedFeatures.includes('Outdoor Parking')) {
                searchModel.hasOutdoorParking = true;
            }
        }

        return searchModel;
    }
} 