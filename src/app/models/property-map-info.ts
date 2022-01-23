import { UserTypeEnum } from "./UserType.enum";
import { FavoriteProperty } from "./favorite-property";

export class PropertyMapInfo {
  constructor(
    public id: string,
    public type: string,
    public vendu: boolean,
    public price: number,
    public address: string,
    public principal: boolean,
    public Longitude: number,
    public Latitude: number
  ) {
  }
}
