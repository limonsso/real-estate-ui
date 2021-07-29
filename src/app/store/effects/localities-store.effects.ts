import {Injectable} from "@angular/core";
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {UserService} from "../../services/user.service";
import {catchError, map, mergeMap} from "rxjs/operators";
import {LocalitiesActionTypes} from "../actions/localities-store.actions";
import {EMPTY} from "rxjs";

@Injectable()
export class LocalitiesStoreEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {
  }


  loadLocalitiesSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalitiesActionTypes.LoadItems),
      mergeMap(() =>
        this.userService.getLocalitiesSearched().pipe(
          map(items => {
            return {type: LocalitiesActionTypes.LoadSuccess, payload: items};
          }),
          catchError(() => EMPTY)
        )
      )
    ))
}
