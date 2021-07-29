import { Injectable } from '@angular/core';
import {GlobalConstants} from "../common/global-constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiBaseUrl = GlobalConstants.reatEstateApiBaseUrl;

  constructor(private readonly http: HttpClient) { }

  getLocalitiesSearched(): Observable<string[]> {
    const url = this.apiBaseUrl + "/localities-search"
    return this.http.get<string[]>(url);
  }
  updateLocalitiesSearched(localitiesSelected: string[]): Observable<string[]> {
    const url = this.apiBaseUrl + "/localities-search"
    return this.http.post<string[]>(url,localitiesSelected);
  }
}
