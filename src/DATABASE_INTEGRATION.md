# Database Integration Guide

This document explains how to integrate the Military Surveillance Scope System with a real-time database.

## Architecture Overview

The system is designed to be database-agnostic and ready for real-time integration. All data types and operations are defined in `/types/database.ts`.

## Data Models

### Operator
```typescript
{
  id: string;
  username: string;
  designation: string; // "Commander", "Tactical Officer", etc.
  position: string; // "Alpha Command", "Operations Lead", etc.
  rank?: string;
  clearanceLevel?: string;
}
```

### Troop
```typescript
{
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
```

### HealthData
Real-time vitals monitoring:
```typescript
{
  troopId: string;
  heartRate: number;
  bodyTemp: number;
  bloodOxygen: number;
  stress: number;
  battery: number;
  armorIntegrity: number;
  timestamp: Date;
}
```

### Target
GPS targets and objectives:
```typescript
{
  id: string;
  name: string;
  type: 'objective' | 'threat' | 'poi';
  lat: number;
  lon: number;
  status: 'active' | 'neutralized' | 'investigating';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  imageUrl?: string;
}
```

### ScopeData
Real-time scope telemetry:
```typescript
{
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
```

## Database Operations Interface

The `DatabaseOperations` interface in `/types/database.ts` defines all required operations:

```typescript
interface DatabaseOperations {
  // Troops
  getTroops: () => Promise<Troop[]>;
  getTroopById: (id: string) => Promise<Troop | null>;
  updateTroopStatus: (id: string, status: Troop['status']) => Promise<void>;
  updateTroopLocation: (id: string, lat: number, lon: number) => Promise<void>;
  
  // Health (Real-time subscriptions)
  getHealthData: (troopId: string) => Promise<HealthData>;
  subscribeToHealthUpdates: (troopId: string, callback: (data: HealthData) => void) => () => void;
  
  // Scope (Real-time subscriptions)
  getScopeData: (troopId: string) => Promise<ScopeData>;
  subscribeToScopeUpdates: (troopId: string, callback: (data: ScopeData) => void) => () => void;
  
  // Targets
  getTargets: () => Promise<Target[]>;
  addTarget: (target: Omit<Target, 'id'>) => Promise<Target>;
  
  // Comms
  sendComms: (message: Omit<CommsLog, 'id' | 'timestamp'>) => Promise<void>;
  subscribeToComms: (callback: (message: CommsLog) => void) => () => void;
}
```

## Integration Examples

### Supabase Integration

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Get troops
const getTroops = async () => {
  const { data, error } = await supabase
    .from('troops')
    .select('*')
    .order('name');
  return data || [];
};

// Subscribe to health updates
const subscribeToHealthUpdates = (troopId: string, callback: (data: HealthData) => void) => {
  const channel = supabase
    .channel(`health:${troopId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'health_data',
        filter: `troop_id=eq.${troopId}`
      },
      (payload) => callback(payload.new as HealthData)
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
```

### Firebase Integration

```typescript
import { getDatabase, ref, onValue, off } from 'firebase/database';

const db = getDatabase();

// Subscribe to troop location updates
const subscribeToTroopLocation = (troopId: string, callback: (troop: Troop) => void) => {
  const troopRef = ref(db, `troops/${troopId}`);
  
  onValue(troopRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
  
  return () => {
    off(troopRef);
  };
};
```

### WebSocket Integration

```typescript
const ws = new WebSocket('wss://your-server.com/surveillance');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'health_update':
      // Update health panel
      updateHealthPanel(data.troopId, data.payload);
      break;
    case 'location_update':
      // Update GPS map
      updateTroopLocation(data.troopId, data.lat, data.lon);
      break;
    case 'scope_update':
      // Update scope telemetry
      updateScopeData(data.troopId, data.payload);
      break;
  }
};
```

## Video Streaming

For live video feeds, you can integrate with:

### WebRTC (Recommended for real-time)
```typescript
const peerConnection = new RTCPeerConnection(configuration);

// Add remote stream to video element
peerConnection.ontrack = (event) => {
  videoElement.srcObject = event.streams[0];
};
```

### HLS/DASH Streaming
```typescript
import Hls from 'hls.js';

if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource('https://your-cdn.com/troop-feed.m3u8');
  hls.attachMedia(videoElement);
}
```

## Mock Data Location

Current mock data is located in:
- `/lib/mockData.ts` - Mock troops, operators, and targets
- Replace imports from this file with real database calls

## Migration Steps

1. **Create database schema** based on types in `/types/database.ts`
2. **Implement DatabaseOperations** interface for your chosen database
3. **Replace mock data imports** in components with database calls
4. **Add real-time subscriptions** for health, location, and scope data
5. **Integrate video streaming** solution for live feeds
6. **Add authentication** and session management
7. **Implement WebSocket/SSE** for real-time updates

## Performance Considerations

- Use database indexes on: `troop_id`, `timestamp`, `status`
- Implement pagination for troop lists
- Cache frequently accessed data (operator profiles, targets)
- Use real-time subscriptions sparingly (only for active scope views)
- Implement connection pooling for database
- Consider CDN for video feeds
- Add rate limiting for API calls

## Security

- Implement row-level security (RLS) in database
- Validate all inputs on server-side
- Use encrypted connections (SSL/TLS)
- Implement proper authentication (JWT, OAuth)
- Add audit logging for all operations
- Sanitize video feed URLs
- Implement role-based access control (RBAC)

## Testing

Mock data is production-ready and can be used for:
- Unit testing
- Integration testing
- Demo environments
- Development mode

To enable mock mode in production:
```typescript
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';
```
