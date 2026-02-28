export interface StacItem {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  geometry: StacGeometry;
  assets: Record<string, unknown>;
  collection: string;
}

export interface StacGeometry {
  type: string;
  coordinates: number[][][];
}

export interface StacSearchParams {
  bbox: [number, number, number, number] | null;
  startDate: string;
  endDate: string;
  collections: string[];
  cloudCoverMax: number;
  limit: number;
}

export interface AreaOfInterest {
  type: 'circle' | 'polygon';
  center?: { lat: number; lng: number };
  radiusKm?: number;
  coordinates?: number[][];
  bbox: [number, number, number, number];
}

export interface CatalogSearchRequest {
  collections?: string[];
  bbox?: [number, number, number, number];
  datetime?: string;
  limit?: number;
  offset?: number;
}

export interface CatalogSearchResponse {
  type: string;
  features: StacItem[];
  numberMatched: number;
  numberReturned: number;
}
