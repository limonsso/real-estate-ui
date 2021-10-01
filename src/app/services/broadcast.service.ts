import {EventEmitter, Injectable} from '@angular/core';
import {Message} from "../models/message";
import {Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private _emmiter: EventEmitter<Message> = new EventEmitter<Message>()

  broadcast(type: string, payload: any = null) {
    console.log(type)
    this._emmiter.next({type, payload});
  }

  subscribe(type: string, callback: (payload: any) => void): Subscription {
    console.log(type)
    return this._emmiter
      .pipe(filter(message => message.type === type)
        , map(message => message.payload))
      .subscribe(callback);
  }
}
