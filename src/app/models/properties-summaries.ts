import {PropertySummary} from "./property-summary";

export class PropertiesSummaries {
  constructor(
    public properties: PropertySummary[],
    public totalPage:number
  ) {}
}
