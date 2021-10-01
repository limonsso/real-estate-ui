import {
  LoadLocalities
} from '../actions/localities-store.actions';
import {Action, createReducer, on} from "@ngrx/store";

export interface LocalitiesState {
  list: string[]
}

export const initialState: LocalitiesState = {
  list: [],
};
const localitiesReducer = createReducer(initialState,
  on(LoadLocalities,
    (state, action) => ({...state, list: [...action.payload]}))
)


export function reducer(state: LocalitiesState | undefined, action: Action) {
  return localitiesReducer(state, action);
}
