import {LocalitiesState} from "./store/reducers/localities-strore.reducer";
import {User} from "./models/user";

export interface AppState {
  readonly localities: LocalitiesState,
  readonly currentUser: User
}
