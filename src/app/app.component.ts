import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {GetLocalities} from "./store/actions/localities-store.actions";
import {LocalitiesState} from "./store/reducers/localities-strore.reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'real-estate-ui';

  constructor(private readonly route: Router,
              private localitiesSelectedStore: Store<LocalitiesState>) {

    this.localitiesSelectedStore.dispatch(GetLocalities());
  }

  ngOnInit(): void {
  }
}
