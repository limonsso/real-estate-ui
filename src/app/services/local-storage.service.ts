import { Injectable } from '@angular/core';
import {LocalStorageRefService} from "./local-storage-ref.service";
import {BehaviorSubject} from "rxjs";
import {User} from "../models/user";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private _localStorage: Storage;
  private _currentUser$ = new BehaviorSubject<User|null>(null)
  public currentUser$ = this._currentUser$.asObservable()

  constructor(private _localStorageRefService: LocalStorageRefService) {
    this._localStorage = _localStorageRefService.localStorage
  }

  setCurrentUser(data: User) {
    const jsonData = JSON.stringify(data)
    this._localStorage.setItem('currentUser', jsonData)
    this._currentUser$.next(data)
  }

  loadCurrentUser() {
    const data = JSON.parse(this._localStorage.getItem('currentUser') ?? '');
    this._currentUser$.next(data)
  }

  clearCurrentUser() {
    this._localStorage.removeItem('myData')
    this._currentUser$.next(null)
  }

  clearAllLocalStorage() {
    this._localStorage.clear()
    this._currentUser$.next(null)
  }
}
