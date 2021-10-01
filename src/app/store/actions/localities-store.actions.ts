import {Action, createAction, props} from '@ngrx/store';



export enum LocalitiesActionTypes {
  LoadItems = '[locality] Load items from server',
  LoadSuccess = '[locality] Load success'
}

export const GetLocalities = createAction(
  LocalitiesActionTypes.LoadItems
);


export const LoadLocalities = createAction(
  LocalitiesActionTypes.LoadSuccess,
  props<{ payload: string[] }>()
);
