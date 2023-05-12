import { Injectable } from '@angular/core';
import { GlobalConstants } from "../common/global-constants";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/user";
import { map } from "rxjs/operators";
import { LocalStorageService } from "angular-web-storage";
import { UserTypeEnum } from "../models/UserType.enum";
import { FavoriteProperty } from "../models/favorite-property";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiBaseUrl = GlobalConstants.reatEstateApiBaseUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = new Observable<User | null>();

  constructor(private readonly http: HttpClient, private readonly localStorage: LocalStorageService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.localStorage.get('currentUser'));
    if (this.currentUserValue === null) {
      this.initGuestUser()
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    const url = this.apiBaseUrl + "/user/login"
    return this.http.post<User>(url, { email: email, password: password }).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      user.userType = UserTypeEnum.Connected
      this.localStorage.set('currentUser', user, 30, 'm');
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  private initGuestUser() {
    var guestUser = new User(0, "", "", [], UserTypeEnum.Guest)
    this.localStorage.set('currentUser', guestUser, 30, 'm');
    this.currentUserSubject.next(guestUser);
  }

  getLocalitiesSearched(): Observable<string[]> {
    const url = this.apiBaseUrl + "/user/localities-searched"
    return this.http.get<string[]>(url);
  }

  RefreshUserConnectedData() {
    const url = this.apiBaseUrl + "/user/info"
    this.http.get<User>(url).subscribe(user => {
      user.userType = UserTypeEnum.Connected
      this.localStorage.set('currentUser', user, 30, 'm');
      this.currentUserSubject.next(user);
    });
  }

  updateLocalitiesSearched(localitiesSelected: string[]) {
    if (this.currentUserValue.userType == UserTypeEnum.Guest) {
      this.updateLocalitiesSearchedUser(localitiesSelected);
    } else {
      const url = this.apiBaseUrl + "/user/localities-search/update"
      this.http.post<string[]>(url, localitiesSelected).subscribe(localities => {
        this.updateLocalitiesSearchedUser(localitiesSelected);
      });
    }
  }

  saveFavoriteProperty(favoriteProperty: FavoriteProperty) {
    if (this.currentUserValue.userType == UserTypeEnum.Connected) {
      const url = this.apiBaseUrl + "/user/favoritep-roperty/save"
      this.http.post<FavoriteProperty>(url, favoriteProperty).subscribe(favorite => {
        this.RefreshUserConnectedData()
      });
    }
  }

  deleteFavoriteProperty(propertyId: string) {
    if (this.currentUserValue.userType == UserTypeEnum.Connected) {
      const url = this.apiBaseUrl + "/user/favorite-property/delete/?PropertyId=" + propertyId
      this.http.delete(url).subscribe(response => {
        this.RefreshUserConnectedData()
      });
    }
  }

  updateLocalitiesSearchedUser(localitiesSelected: string[]) {
    let user = this.localStorage.get('currentUser')
    user.localitiesSelectedLastSearch = localitiesSelected;
    this.localStorage.set('currentUser', user, 30, 'm');
    this.currentUserSubject.next(user);
  }


  logout() {
    this.localStorage.remove('currentUser');
    this.initGuestUser();
  }
}
