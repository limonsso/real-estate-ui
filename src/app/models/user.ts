import {UserTypeEnum} from "./UserType.enum";
import {FavoriteProperty} from "./favorite-property";

export class User {
  constructor(
    public id: number,
    public email: string,
    public token: string,
    public localitiesSelectedLastSearch:string[],
    public userType: UserTypeEnum,
    public favoritesProperties:FavoriteProperty[]=[]) {
  }
}
