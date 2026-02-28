export interface OrderConfiguration {
  poi: PointOfInterest | null;
  cloudCoverMax: number;
  spectralBands: string[];
  deliveryFormat: string;
  processingLevel: string;
  notes: string;
}

export interface PointOfInterest {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface OrderSchedule {
  orderName: string;
  startDate: string;
  endDate: string;
  expirationDate: string;
  priority: string;
  recurring: boolean;
  frequency: string;
  dayOfWeek: string;
  deliveryWindow: string;
}

export interface OrderRequest {
  familyId: string;
  productTypeId: string;
  tierId: string;
  configuration: OrderConfiguration;
  schedule: OrderSchedule;
  selectedSceneIds?: string[];
}

export interface OrderResponse {
  orderId: string;
  status: string;
  familyId: string;
  productTypeId: string;
  tierId: string;
  configuration: OrderConfiguration;
  schedule: OrderSchedule;
  createdAt: string;
}
