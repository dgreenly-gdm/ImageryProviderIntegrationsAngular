export interface FamilyConfig {
  id: string;
  name: string;
  color: string;
  cssClass: string;
  description: string;
  productCount: number;
  available: boolean;
}

export interface ImageryTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  tiers: ImageryTierConfig[];
}

export interface ImageryTierConfig {
  id: string;
  name: string;
  description: string;
  gsdRange: string;
  deliveryTime: string;
  pricePerSqKm: number;
}

export const FAMILIES: FamilyConfig[] = [
  {
    id: 'imagery',
    name: 'Imagery',
    color: '#3B82F6',
    cssClass: 'family-blue',
    description: 'Satellite imagery across EO, IR, SAR, Sat-to-Sat, and Sky Imagery',
    productCount: 24,
    available: true,
  },
  {
    id: 'analytic-reports',
    name: 'Analytic Reports',
    color: '#10B981',
    cssClass: 'family-green',
    description: 'Intelligence analysis reports with varying depth and turnaround',
    productCount: 12,
    available: false,
  },
  {
    id: 'sda',
    name: 'Space Domain Awareness',
    color: '#7C3AED',
    cssClass: 'family-purple',
    description: 'Space situational awareness products and conjunction data',
    productCount: 85,
    available: false,
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    color: '#F59E0B',
    cssClass: 'family-orange',
    description: 'Ongoing data subscriptions for continuous monitoring',
    productCount: 101,
    available: false,
  },
  {
    id: 'terrestrial-rf',
    name: 'Terrestrial RF',
    color: '#E11D48',
    cssClass: 'family-rose',
    description: 'RF geolocation and GNSS monitoring services',
    productCount: 7,
    available: false,
  },
];

export const IMAGERY_TYPES: ImageryTypeConfig[] = [
  {
    id: 'eo',
    name: 'Electro-Optical (EO)',
    description: 'High-resolution visible spectrum satellite imagery for precision targeting and mapping',
    icon: 'eye',
    tiers: [
      { id: 'eo-precision', name: 'Precision Pinpoint', description: 'Highest resolution EO imagery for precision identification', gsdRange: '0.3 - 0.5m', deliveryTime: '2 - 4 hours', pricePerSqKm: 12.5 },
      { id: 'eo-tactical', name: 'Tactical', description: 'High-resolution EO imagery for tactical operations', gsdRange: '0.5 - 1.0m', deliveryTime: '4 - 8 hours', pricePerSqKm: 8.0 },
      { id: 'eo-operational', name: 'Operational', description: 'Standard resolution EO imagery for operational planning', gsdRange: '1.0 - 2.5m', deliveryTime: '8 - 24 hours', pricePerSqKm: 4.5 },
      { id: 'eo-theater', name: 'Theater', description: 'Wide-area EO imagery for theater-level awareness', gsdRange: '2.5 - 5.0m', deliveryTime: '24 - 48 hours', pricePerSqKm: 2.0 },
    ],
  },
  {
    id: 'ir',
    name: 'Infrared (IR)',
    description: 'Thermal and near-infrared imagery for day/night all-weather operations',
    icon: 'flame',
    tiers: [
      { id: 'ir-precision', name: 'Precision Pinpoint', description: 'Highest resolution IR imagery for precision thermal detection', gsdRange: '0.3 - 0.5m', deliveryTime: '2 - 4 hours', pricePerSqKm: 15.0 },
      { id: 'ir-tactical', name: 'Tactical', description: 'High-resolution IR imagery for tactical thermal operations', gsdRange: '0.5 - 1.0m', deliveryTime: '4 - 8 hours', pricePerSqKm: 10.0 },
      { id: 'ir-operational', name: 'Operational', description: 'Standard resolution IR for operational thermal mapping', gsdRange: '1.0 - 2.5m', deliveryTime: '8 - 24 hours', pricePerSqKm: 6.0 },
      { id: 'ir-theater', name: 'Theater', description: 'Wide-area IR imagery for theater-level thermal awareness', gsdRange: '2.5 - 5.0m', deliveryTime: '24 - 48 hours', pricePerSqKm: 3.0 },
    ],
  },
  {
    id: 'sar',
    name: 'Synthetic Aperture Radar (SAR)',
    description: 'All-weather radar imagery that penetrates clouds and operates day or night',
    icon: 'radar',
    tiers: [
      { id: 'sar-precision', name: 'Precision Pinpoint', description: 'Highest resolution SAR imagery for precision detection', gsdRange: '0.3 - 0.5m', deliveryTime: '2 - 4 hours', pricePerSqKm: 18.0 },
      { id: 'sar-tactical', name: 'Tactical', description: 'High-resolution SAR imagery for tactical all-weather ops', gsdRange: '0.5 - 1.0m', deliveryTime: '4 - 8 hours', pricePerSqKm: 12.0 },
      { id: 'sar-operational', name: 'Operational', description: 'Standard resolution SAR for operational planning', gsdRange: '1.0 - 2.5m', deliveryTime: '8 - 24 hours', pricePerSqKm: 7.0 },
      { id: 'sar-theater', name: 'Theater', description: 'Wide-area SAR imagery for theater-level monitoring', gsdRange: '2.5 - 5.0m', deliveryTime: '24 - 48 hours', pricePerSqKm: 3.5 },
    ],
  },
  {
    id: 'sat-to-sat',
    name: 'Sat-to-Sat',
    description: 'Satellite-to-satellite observation imagery for space domain awareness',
    icon: 'orbit',
    tiers: [
      { id: 's2s-leo', name: 'LEO', description: 'Low Earth Orbit satellite-to-satellite observation', gsdRange: 'N/A', deliveryTime: '4 - 8 hours', pricePerSqKm: 25.0 },
      { id: 's2s-meo', name: 'MEO', description: 'Medium Earth Orbit satellite-to-satellite observation', gsdRange: 'N/A', deliveryTime: '8 - 16 hours', pricePerSqKm: 30.0 },
      { id: 's2s-geo', name: 'GEO', description: 'Geostationary orbit satellite-to-satellite observation', gsdRange: 'N/A', deliveryTime: '12 - 24 hours', pricePerSqKm: 40.0 },
      { id: 's2s-heo', name: 'HEO-Cislunar', description: 'Highly elliptical and cislunar orbit observation', gsdRange: 'N/A', deliveryTime: '24 - 72 hours', pricePerSqKm: 55.0 },
    ],
  },
  {
    id: 'sky',
    name: 'Sky Imagery',
    description: 'Ground-based optical tracking of satellites and space objects',
    icon: 'telescope',
    tiers: [
      { id: 'sky-leo', name: 'LEO Detect', description: 'Detect and track LEO objects from ground-based sensors', gsdRange: 'N/A', deliveryTime: '1 - 4 hours', pricePerSqKm: 8.0 },
      { id: 'sky-meo', name: 'MEO Monitor', description: 'Monitor MEO constellation objects', gsdRange: 'N/A', deliveryTime: '4 - 12 hours', pricePerSqKm: 12.0 },
      { id: 'sky-geo', name: 'GEO Surveillance', description: 'Persistent surveillance of GEO belt objects', gsdRange: 'N/A', deliveryTime: '6 - 24 hours', pricePerSqKm: 18.0 },
      { id: 'sky-deep', name: 'Deep Space', description: 'Deep space object detection beyond GEO', gsdRange: 'N/A', deliveryTime: '24 - 72 hours', pricePerSqKm: 35.0 },
      { id: 'sky-all', name: 'All-Regime', description: 'Comprehensive tracking across all orbital regimes', gsdRange: 'N/A', deliveryTime: '12 - 48 hours', pricePerSqKm: 50.0 },
    ],
  },
];
