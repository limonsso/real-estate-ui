export class PropertyDetails {
  constructor(
    public id: string,
    public company: string,
    public city: string,
    public street: string,
    public type: string,
    public description: string,
    public price: number,
    public images: string[],
    public isSold: boolean
  ) {}
}
