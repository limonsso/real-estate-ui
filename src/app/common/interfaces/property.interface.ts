export interface Location {
    lat: number;
    lng: number;
}

export interface Price {
    sale: number;
    rent: number;
}

export interface Area {
    value: number;
    unit: string;
}

export interface AdditionalFeature {
    name: string;
    value: string;
}

export interface GalleryImage {
    small: string;
    medium: string;
    big: string;
}

export interface Plan {
    name: string;
    desc: string;
    area: Area;
    rooms: number;
    baths: number;
    image: string;
}

export interface Video {
    name: string;
    link: string;
}

export interface Property {
    id: string;
    title: string;
    desc: string;
    propertyType: string;
    propertyStatus: string[];
    city: string;
    zipCode: string;
    neighborhood: string[];
    street: string[];
    location: Location;
    formattedAddress: string;
    features: string[];
    featured: boolean;
    priceDollar: Price;
    priceEuro: Price;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    area: Area;
    yearBuilt: number;
    ratingsCount: number;
    ratingsValue: number;
    additionalFeatures: AdditionalFeature[];
    gallery: GalleryImage[];
    plans: Plan[];
    videos: Video[];
    published: string;
    lastUpdate: string;
    views: number;
}

export interface PropertyResponse {
    properties: Property[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
} 