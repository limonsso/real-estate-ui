import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Property, Location, Area, AdditionalFeature, Plan, Price } from '@models/app.models';
import { Testimonial } from '../common/interfaces/testimonial';
import { Agent } from '../common/interfaces/agent';
import { Client } from '../common/interfaces/client';
import { PropertyResponse } from '../common/interfaces/property.interface';
import { PaginationParams, PaginatedResponse } from '../common/interfaces/pagination.interface';
import { PropertySearchModel } from '../common/interfaces/property-search.interface';
import { PropertyType } from '../common/interfaces/property-type.interface';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private apiKey = 'AIzaSyAO7Mg2Cs1qzo_3jkKkZAKY6jtwIlm41-I';

    constructor(private http: HttpClient) { }

    // Méthode générique pour les requêtes GET
    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${endpoint}`);
    }

    // Méthode générique pour les requêtes POST
    post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${endpoint}`, data);
    }

    // Méthode générique pour les requêtes PUT
    put<T>(endpoint: string, data: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${endpoint}`, data);
    }

    // Méthode générique pour les requêtes DELETE
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${endpoint}`);
    }

    // Méthodes spécifiques pour les propriétés
    getProperties(searchParams: Partial<PropertySearchModel> = {}): Observable<PaginatedResponse<Property>> {
        const params = {
            pageNumber: searchParams.pageNumber || 1,
            pageSize: searchParams.pageSize || 10,
            ...searchParams
        };

        return this.http.get<PropertyResponse>(`${this.apiUrl}/Properties/search`, { params }).pipe(
            map(response => ({
                items: response.properties.map(p => this.mapToProperty(p)),
                totalCount: response.totalCount,
                pageNumber: response.pageNumber,
                pageSize: response.pageSize,
                totalPages: response.totalPages
            }))
        );
    }

    getPropertyById(id: string): Observable<Property> {
        return this.http.get<Property>(`${this.apiUrl}/Properties/${id}`).pipe(
            map(p => this.mapToProperty(p))
        );
    }

    getFeaturedProperties(): Observable<Property[]> {
        return this.http.get<PropertyResponse>(`${this.apiUrl}/Properties/featured`).pipe(
            map(response => response.properties.map(p => this.mapToProperty(p)))
        );
    }

    getRelatedProperties(): Observable<Property[]> {
        return this.http.get<PropertyResponse>(`${this.apiUrl}/Properties/related`).pipe(
            map(response => response.properties.map(p => this.mapToProperty(p)))
        );
    }

    getPropertiesByAgentId(agentId: string): Observable<Property[]> {
        return this.http.get<PropertyResponse>(`${this.apiUrl}/Properties/agent/${agentId}`).pipe(
            map(response => response.properties.map(p => this.mapToProperty(p)))
        );
    }

    // Méthodes pour les localisations
    getLocations(): Observable<Location[]> {
        return this.get<Location[]>('/locations');
    }

    // Méthodes pour Google Maps
    getAddress(lat = 40.714224, lng = -73.961452) {
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`);
    }

    getLatLng(address: string) {
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${this.apiKey}&address=${address}`);
    }

    // Méthodes pour les données statiques
    getPropertyTypes(): Observable<PropertyType[]> {
        return this.get<PropertyType[]>('/PropertyTypes');
    }

    getPropertyStatuses() {
        return [
            { id: 1, name: 'For Sale' },
            { id: 2, name: 'For Rent' },
            { id: 3, name: 'Open House' },
            { id: 4, name: 'No Fees' },
            { id: 5, name: 'Hot Offer' },
            { id: 6, name: 'Sold' }
        ];
    }

    // Méthodes pour les autres entités
    getTestimonials(): Observable<Testimonial[]> {
        return this.get<Testimonial[]>('/testimonials');
    }

    getAgents(): Observable<Agent[]> {
        return this.get<Agent[]>('/agents');
    }

    getClients(): Observable<Client[]> {
        return this.get<Client[]>('/clients');
    }

    // Méthode de filtrage générique
    filterData(data: any[], params: any, sort?: any, page?: number, perPage?: number) {
        let filteredData = [...data];

        // Filtrage
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    filteredData = filteredData.filter(item => {
                        if (typeof params[key] === 'string') {
                            return item[key].toLowerCase().includes(params[key].toLowerCase());
                        }
                        return item[key] === params[key];
                    });
                }
            });
        }

        // Tri
        if (sort) {
            filteredData = this.sortData(sort, filteredData);
        }

        // Pagination
        if (page && perPage) {
            filteredData = this.paginator(filteredData, page, perPage);
        }

        return filteredData;
    }

    private sortData(sort: any, data: any[]) {
        return data.sort((a, b) => {
            const aValue = a[sort.field];
            const bValue = b[sort.field];

            if (sort.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    private paginator(items: any[], page: number, perPage: number) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return items.slice(start, end);
    }

    private mapToProperty(data: any): Property {
        return new Property(
            parseInt(data.id),
            data.title,
            data.desc,
            data.propertyType,
            data.propertyStatus,
            data.city,
            Array.isArray(data.zipCode) ? data.zipCode : [data.zipCode],
            data.neighborhood,
            data.street,
            new Location(parseInt(data.id), data.location.lat, data.location.lng),
            data.formattedAddress,
            data.features,
            data.featured,
            data.priceDollar,
            data.priceEuro,
            data.bedrooms,
            data.bathrooms,
            data.garages,
            new Area(0, data.area.value, data.area.unit),
            data.yearBuilt,
            data.ratingsCount,
            data.ratingsValue,
            data.additionalFeatures.map((af: any) => new AdditionalFeature(0, af.name, af.value)),
            data.gallery,
            data.plans.map((p: any) => new Plan(0, p.name, p.desc, new Area(0, p.area.value, p.area.unit), p.rooms, p.baths, p.image)),
            data.videos,
            data.published,
            data.lastUpdate,
            data.views
        );
    }

    // Méthodes pour les données statiques
    getStaticPropertyTypes(): PropertyType[] {
        return [
            {
                id: 'office',
                category: 'Commercial',
                description: 'Espace de bureau commercial',
                features: ['Espace de travail', 'Salle de conférence', 'Parking'],
                commonUses: ['Bureau', 'Consultation'],
                typicalCharacteristics: {
                    units: 1,
                    minBedroomsPerUnit: 0,
                    minBathroomsPerUnit: 1,
                    minLandSize: '1000'
                },
                displayName: 'Bureau à vendre'
            },
            {
                id: 'house',
                category: 'Résidentiel',
                description: 'Maison unifamiliale',
                features: ['Jardin', 'Garage', 'Sous-sol'],
                commonUses: ['Résidence principale', 'Résidence secondaire'],
                typicalCharacteristics: {
                    units: 1,
                    minBedroomsPerUnit: 2,
                    minBathroomsPerUnit: 1,
                    minLandSize: '5000'
                },
                displayName: 'Maison à vendre'
            },
            {
                id: 'apartment',
                category: 'Résidentiel',
                description: 'Appartement en copropriété',
                features: ['Ascenseur', 'Sécurité', 'Stationnement'],
                commonUses: ['Résidence principale', 'Investissement'],
                typicalCharacteristics: {
                    units: 1,
                    minBedroomsPerUnit: 1,
                    minBathroomsPerUnit: 1,
                    minLandSize: '800'
                },
                displayName: 'Appartement à vendre'
            }
        ];
    }
} 