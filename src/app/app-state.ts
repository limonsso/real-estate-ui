import {LocalitiesState} from "./store/reducers/localities-strore.reducer";

export interface AppState {
  readonly localitiesSelected: LocalitiesState
}
