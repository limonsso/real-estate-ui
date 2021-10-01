import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {GetLocalities} from "./store/actions/localities-store.actions";
import {LocalitiesState} from "./store/reducers/localities-strore.reducer";
import {BroadcastService} from "./services/broadcast.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'real-estate-ui';

  constructor(
    private  readonly  broadcastService: BroadcastService,
    private readonly route: Router,
        private store: Store<LocalitiesState>) {
    this.store.dispatch(GetLocalities());
  }

  ngOnInit(): void {

    this.broadcastService.subscribe('user-is-connected',()=>{
      window.location.reload()
    })
  }
}
