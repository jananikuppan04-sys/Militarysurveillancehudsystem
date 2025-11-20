// Database-ready type definitions for real-time surveillance system

export interface Operator {
  id: string;
  username: string;
  designation: string; // e.g., "Commander", "Tactical Officer", "Operations Lead"
  position: string; // e.g., "Alpha Command", "Bravo Support", "Charlie Recon"
  rank?: string;
  clearanceLevel?: string;
}

export interface Troop {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'offline';
  lastPing: string;
  lat: number;
  lon: number;
  altitude?: number;
  heading?: number;
  videoFeedUrl?: string;
  thumbnailUrl?: string;
}

export interface HealthData {
  troopId: string;
  heartRate: number;
  bodyTemp: number;
  bloodOxygen: number;
  stress: number;
  battery: number;
  armorIntegrity: number;
  timestamp: Date;
}

export interface Target {
  id: string;
  name: string;
  type: 'objective' | 'threat' | 'poi'; // Point of Interest
  lat: number;
  lon: number;
  status: 'active' | 'neutralized' | 'investigating';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  imageUrl?: string;
}

export interface ScopeData {
  troopId: string;
  range: number;
  altitude: number;
  azimuth: number;
  elevation: number;
  zoom: number;
  fov: number;
  mode: 'VIS' | 'MWIR' | 'THERMAL' | 'FUSION';
  isRecording: boolean;
  videoFeedUrl?: string;
  timestamp: Date;
}

export interface CommsLog {
  id: string;
  operatorId: string;
  troopId?: string;
  type: 'individual' | 'broadcast';
  message: string;
  timestamp: Date;
}

// Database update operations (ready for real-time integration)
export interface DatabaseOperations {
  // Troops
  getTroops: () => Promise<Troop[]>;
  getTroopById: (id: string) => Promise<Troop | null>;
  updateTroopStatus: (id: string, status: Troop['status']) => Promise<void>;
  updateTroopLocation: (id: string, lat: number, lon: number) => Promise<void>;
  
  // Health
  getHealthData: (troopId: string) => Promise<HealthData>;
  subscribeToHealthUpdates: (troopId: string, callback: (data: HealthData) => void) => () => void;
  
  // Scope
  getScopeData: (troopId: string) => Promise<ScopeData>;
  subscribeToScopeUpdates: (troopId: string, callback: (data: ScopeData) => void) => () => void;
  
  // Targets
  getTargets: () => Promise<Target[]>;
  addTarget: (target: Omit<Target, 'id'>) => Promise<Target>;
  
  // Comms
  sendComms: (message: Omit<CommsLog, 'id' | 'timestamp'>) => Promise<void>;
  subscribeToComms: (callback: (message: CommsLog) => void) => () => void;
}
