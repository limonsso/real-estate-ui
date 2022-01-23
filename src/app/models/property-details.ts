export class PropertyDetails {

  constructor(
    public id: string,
    public company: string,
    public city: string,
    public street: string,
    public link: string,
    public type: string,
    public description: string,
    public images: string[],
    public annee: string,
    public superficie: string,
    public unites: any,
    public price: number,
    public revenusAnnuelBruts: number,
    public vendue: boolean,
    public taxesScolaires: number,
    public taxesMunicipale: number,
    public latitude: number,
    public longitude: number,
    public nearProperties: PropertyDetails[]
  ) {

  }
}
