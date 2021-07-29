import {Action, createAction, props} from '@ngrx/store';



export enum LocalitiesActionTypes {
  Update = '[locality] Add to localities-store',
  LoadItems = '[locality] Load items from server',
  LoadSuccess = '[locality] Load success'
}
export const UpdateStore = createAction(
  LocalitiesActionTypes.Update,
  props<{ payload: string[] }>()
);

export const GetLocalities = createAction(
  LocalitiesActionTypes.LoadItems
);


export const LoadLocalities = createAction(
  LocalitiesActionTypes.LoadSuccess,
  props<{ payload: string[] }>()
);
