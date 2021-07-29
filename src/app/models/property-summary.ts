export class PropertySummary {
  constructor(
    public id: string,
    public company: string,
    public city: string,
    public street: string,
    public type: string,
    public price: number,
    public description: string,
    public imgThumbnail: string
  ) {
  }
}
