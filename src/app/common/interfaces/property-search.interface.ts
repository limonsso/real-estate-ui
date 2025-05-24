export interface PropertySearchModel {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    region?: string;
    minConstructionYear?: number;
    maxConstructionYear?: number;
    minSurface?: number;
    maxSurface?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minLotSize?: number;
    maxLotSize?: number;
    isSold?: boolean;
    buildingStyle?: string;
    hasIndoorParking?: boolean;
    hasOutdoorParking?: boolean;
    minParkingSpaces?: number;
    pageNumber?: number;
    pageSize?: number;
} 