export interface TypicalCharacteristics {
    units: number;
    minBedroomsPerUnit: number;
    minBathroomsPerUnit: number;
    minLandSize: string;
}

export interface PropertyType {
    id: string;
    category: string;
    description: string;
    features: string[];
    commonUses: string[];
    typicalCharacteristics: TypicalCharacteristics;
    displayName: string;
} 