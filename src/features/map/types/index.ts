export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapZone {
  id: string;
  name: string;
  emoji: string;
  description: string;
  coordinates: MapCoordinates;
  bounds?: MapBounds;
  postCount: number;
  isActive: boolean;
  color?: string;
}

export interface MapPin {
  id: string;
  coordinates: MapCoordinates;
  type: 'POST' | 'ZONE' | 'BUSINESS' | 'LANDMARK';
  title: string;
  description?: string;
  count?: number;
  emoji?: string;
  color?: string;
  zIndex?: number;
}

export interface PostPin extends MapPin {
  type: 'POST';
  postId: string;
  authorName: string;
  tags: string[];
  score: number;
  createdAt: Date;
}

export interface ZonePin extends MapPin {
  type: 'ZONE';
  zoneId: string;
  postCount: number;
  recentActivity: Date;
}

export interface BusinessPin extends MapPin {
  type: 'BUSINESS';
  businessId: string;
  category: string;
  verified: boolean;
  rating?: number;
}

export interface LandmarkPin extends MapPin {
  type: 'LANDMARK';
  landmarkId: string;
  category: 'HISTORICAL' | 'CULTURAL' | 'NATURAL' | 'TRANSPORT';
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface MapViewState {
  center: MapCoordinates;
  zoom: number;
  bounds?: MapBounds;
}

export interface MapFilters {
  showPosts: boolean;
  showZones: boolean;
  showBusinesses: boolean;
  showLandmarks: boolean;
  timeRange?: 'day' | 'week' | 'month' | 'all';
  minScore?: number;
  tags?: string[];
}

export interface MapCluster {
  id: string;
  coordinates: MapCoordinates;
  count: number;
  pins: MapPin[];
  bounds: MapBounds;
}

export type MapEvent = 
  | { type: 'ZONE_CLICK'; zoneId: string; coordinates: MapCoordinates }
  | { type: 'PIN_CLICK'; pin: MapPin }
  | { type: 'MAP_CLICK'; coordinates: MapCoordinates }
  | { type: 'BOUNDS_CHANGE'; bounds: MapBounds; zoom: number }
  | { type: 'CLUSTER_CLICK'; cluster: MapCluster };

// Configuration par défaut pour Meudon
export const MEUDON_MAP_CONFIG = {
  center: { lat: 48.8139, lng: 2.2364 } as MapCoordinates,
  defaultZoom: 14,
  minZoom: 12,
  maxZoom: 18,
  bounds: {
    north: 48.8350,
    south: 48.7950,
    east: 2.2650,
    west: 2.2050,
  } as MapBounds,
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
};
