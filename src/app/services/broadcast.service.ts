import {EventEmitter, Injectable} from '@angular/core';
import {Message} from "../models/message";
import {Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private _emmiter: EventEmitter<Message> = new EventEmitter<Message>()

  boradcast(type: string, payload: any = null) {
    this._emmiter.next({type, payload});
  }

  subscribe(type: string, callback: (payload: any) => void): Subscription {
    return this._emmiter
      .pipe(filter(message => message.type === type)
        , map(message => message.payload))
      .subscribe(callback);
  }
}
