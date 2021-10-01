import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {map} from "rxjs/operators";
import {GlobalConstants} from "../common/global-constants";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MortgageCalculatorService {
  private readonly apiBaseUrl = GlobalConstants.mortgageCalculatorApiBaseUrl;

  constructor(private readonly http: HttpClient) { }

  calculate_montant_versement(hypoteque:number,nbr_annee:number,interet:number): Observable<number>{
    var url = this.apiBaseUrl+'/mortgage/GetMontantMensuel'
    return this.http.post<number>(url, {hypoteque: hypoteque, nbr_annee: nbr_annee,interet_annuel:interet})
      .pipe(map(montant => {
      return montant;
    }));
  }

  calculate_montant_mrb(hypoteque:number,revenu:number): Observable<number>{
    var url = this.apiBaseUrl+'/mortgage/GetMRB'
    return this.http.post<number>(url, {revenu_brut: revenu,prix_dachat: hypoteque})
      .pipe(map(montant => {
        return montant;
      }));
  }

  calculate_montant_rno(revenu:number,depenses:number): Observable<number>{
    var url = this.apiBaseUrl+'/mortgage/GetMRN'
    return this.http.post<number>(url, {revenu_brut: revenu,depenses_op: depenses})
      .pipe(map(montant => {
        return montant;
      }));
  }

  calculate_montant_mrn(hypoteque:number,rno:number): Observable<number>{
    var url = this.apiBaseUrl+'/mortgage/GetMRN'
    return this.http.post<number>(url, {prix_dachat: hypoteque,revenu_net_dop: rno})
      .pipe(map(montant => {
        return montant;
      }));
  }
}
