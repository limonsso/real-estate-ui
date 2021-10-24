import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalConstants} from "../common/global-constants";
import {PropertySummary} from "../models/property-summary";
import {Observable} from "rxjs";
import {PropertiesSummaries} from "../models/properties-summaries";
import {PropertyDetails} from "../models/property-details";

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly apiBaseUrl = GlobalConstants.reatEstateApiBaseUrl;

  constructor(private readonly http: HttpClient) {
  }

  getLocalities(): Observable<string[]> {
    const url = this.apiBaseUrl + "/property/getalllocalities"
    return this.http.get<string[]>(url);
  }

  getPropertiesListByLocalitiesWithPaging(localities: string[], pageNumber: number = 1, pageSize: number = 10, companyName: string = '', onSaleOnly = false): Observable<PropertiesSummaries> {
    const url = this.apiBaseUrl + `/property/findpropertiesbylocalitieswithpaging/${pageNumber}`
    return this.http.post<PropertiesSummaries>(url, {
      localities: localities,
      pageSize: pageSize,
      companyName: companyName,
      onSaleOnly: onSaleOnly
    });
  }

  getPropertiesListByLocalities(localities: string[]): Observable<PropertySummary[]> {
    const url = this.apiBaseUrl + `/property/findpropertiesbylocalities`
    return this.http.post<PropertySummary[]>(url, localities);
  }

  getPropertyDetails(id: number): Observable<PropertyDetails> {
    const url = this.apiBaseUrl + `/property/getpropertydetails/${id}`
    return this.http.get<PropertyDetails>(url);
  }

  getPropertiesDetails(ids: string[]): Observable<PropertyDetails[]> {
    const url = this.apiBaseUrl + `/property/getpropertiesdetails`
    return this.http.post<PropertyDetails[]>(url, ids);
  }
}
