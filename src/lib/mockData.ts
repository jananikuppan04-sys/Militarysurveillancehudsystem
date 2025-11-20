import { Troop, Target, Operator } from '../types/database';

// Mock operator data
export const mockOperators: Record<string, Operator> = {
  'admin': {
    id: 'op-001',
    username: 'admin',
    designation: 'Commander',
    position: 'Alpha Command',
    rank: 'Colonel',
    clearanceLevel: 'Level 5'
  },
  'officer': {
    id: 'op-002',
    username: 'officer',
    designation: 'Tactical Officer',
    position: 'Operations Lead',
    rank: 'Major',
    clearanceLevel: 'Level 4'
  }
};

// Mock troop data with real images
export const mockTroops: (Troop & { videoFeedUrl: string })[] = [
  {
    id: 'alpha-1',
    name: 'ALPHA-1',
    status: 'active',
    lastPing: '00:02 ago',
    lat: 34.052235,
    lon: -118.243683,
    altitude: 1245,
    heading: 87,
    videoFeedUrl: 'https://images.unsplash.com/photo-1715098652741-3613654cd2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1715098652741-3613654cd2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'alpha-2',
    name: 'ALPHA-2',
    status: 'active',
    lastPing: '00:05 ago',
    lat: 34.062235,
    lon: -118.253683,
    altitude: 1280,
    heading: 120,
    videoFeedUrl: 'https://images.unsplash.com/photo-1600461689921-6f67bb7233ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600461689921-6f67bb7233ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'alpha-3',
    name: 'ALPHA-3',
    status: 'standby',
    lastPing: '01:24 ago',
    lat: 34.042235,
    lon: -118.233683,
    altitude: 1210,
    heading: 45,
    videoFeedUrl: 'https://images.unsplash.com/photo-1763092664939-fd5abc952387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1763092664939-fd5abc952387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'bravo-1',
    name: 'BRAVO-1',
    status: 'active',
    lastPing: '00:01 ago',
    lat: 34.072235,
    lon: -118.263683,
    altitude: 1320,
    heading: 200,
    videoFeedUrl: 'https://images.unsplash.com/photo-1688584177352-a40d4ba17561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1688584177352-a40d4ba17561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'bravo-2',
    name: 'BRAVO-2',
    status: 'offline',
    lastPing: '12:45 ago',
    lat: 34.032235,
    lon: -118.223683,
    altitude: 1180,
    heading: 315,
    videoFeedUrl: 'https://images.unsplash.com/photo-1664292241455-de41d03c5897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1664292241455-de41d03c5897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'bravo-3',
    name: 'BRAVO-3',
    status: 'active',
    lastPing: '00:03 ago',
    lat: 34.082235,
    lon: -118.273683,
    altitude: 1350,
    heading: 90,
    videoFeedUrl: 'https://images.unsplash.com/photo-1715098652741-3613654cd2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1715098652741-3613654cd2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'charlie-1',
    name: 'CHARLIE-1',
    status: 'standby',
    lastPing: '02:18 ago',
    lat: 34.022235,
    lon: -118.213683,
    altitude: 1150,
    heading: 270,
    videoFeedUrl: 'https://images.unsplash.com/photo-1600461689921-6f67bb7233ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600461689921-6f67bb7233ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'charlie-2',
    name: 'CHARLIE-2',
    status: 'active',
    lastPing: '00:08 ago',
    lat: 34.092235,
    lon: -118.283683,
    altitude: 1380,
    heading: 180,
    videoFeedUrl: 'https://images.unsplash.com/photo-1763092664939-fd5abc952387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    thumbnailUrl: 'https://images.unsplash.com/photo-1763092664939-fd5abc952387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
];

// Mock target data with realistic coordinates
export const mockTargets: Target[] = [
  {
    id: 'target-1',
    name: 'OBJECTIVE ALPHA',
    type: 'objective',
    lat: 34.065235,
    lon: -118.255683,
    status: 'active',
    priority: 'high',
    description: 'Primary mission objective - Building Delta-7',
    imageUrl: 'https://images.unsplash.com/photo-1688584177352-a40d4ba17561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'target-2',
    name: 'THREAT BRAVO',
    type: 'threat',
    lat: 34.048235,
    lon: -118.238683,
    status: 'active',
    priority: 'high',
    description: 'Hostile activity detected',
    imageUrl: 'https://images.unsplash.com/photo-1715098652741-3613654cd2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'target-3',
    name: 'POI CHARLIE',
    type: 'poi',
    lat: 34.078235,
    lon: -118.268683,
    status: 'investigating',
    priority: 'medium',
    description: 'Suspicious vehicle - Under surveillance',
    imageUrl: 'https://images.unsplash.com/photo-1600461689921-6f67bb7233ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'target-4',
    name: 'OBJECTIVE DELTA',
    type: 'objective',
    lat: 34.038235,
    lon: -118.228683,
    status: 'active',
    priority: 'medium',
    description: 'Secondary extraction point',
    imageUrl: 'https://images.unsplash.com/photo-1763092664939-fd5abc952387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

// Helper function to get operator by username
export const getOperatorByUsername = (username: string): Operator => {
  return mockOperators[username.toLowerCase()] || {
    id: `op-${Date.now()}`,
    username: username,
    designation: 'Operator',
    position: 'Field Support',
    rank: 'Lieutenant',
    clearanceLevel: 'Level 3'
  };
};

// Helper to get troop by ID
export const getTroopById = (id: string) => {
  return mockTroops.find(t => t.id === id);
};
