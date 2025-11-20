import { MapPin, Plus, Minus, Navigation, Target as TargetIcon, AlertTriangle } from 'lucide-react';
import { useNightMode } from '../App';
import { Troop, Target } from '../types/database';
import { mockTargets } from '../lib/mockData';

interface GPSMapProps {
  troops?: Troop[];
  selectedTroopId?: string | null;
  showMultiple?: boolean;
  showTargets?: boolean;
}

export default function GPSMap({ 
  troops = [], 
  selectedTroopId, 
  showMultiple = true,
  showTargets = true 
}: GPSMapProps) {
  const { isNightMode } = useNightMode();

  const selectedTroop = troops.find(t => t.id === selectedTroopId);

  // Calculate relative positions (simplified for display)
  const getRelativePosition = (lat: number, lon: number) => {
    const baseLat = 34.052235;
    const baseLon = -118.243683;
    const latDiff = (lat - baseLat) * 1000; // Simplified conversion
    const lonDiff = (lon - baseLon) * 1000;
    
    return {
      x: 50 + lonDiff * 2, // Center at 50% and scale
      y: 50 - latDiff * 2
    };
  };

  const getTargetColor = (target: Target) => {
    if (target.type === 'threat') return 'text-red-400';
    if (target.type === 'objective') return isNightMode ? 'text-cyan-400' : 'text-green-400';
    return 'text-yellow-400';
  };

  const getTargetIcon = (target: Target) => {
    if (target.type === 'threat') return AlertTriangle;
    return TargetIcon;
  };

  return (
    <div className={`border h-full flex flex-col ${
      isNightMode ? 'border-cyan-400/30 bg-black/50' : 'border-green-400/30 bg-[#0a0e14]/50'
    }`}>
      {/* Header */}
      <div className={`border-b px-4 py-3 ${
        isNightMode ? 'border-cyan-400/30' : 'border-green-400/30'
      }`}>
        <h3 className={`tracking-wider ${
          isNightMode ? 'text-cyan-400' : 'text-green-400'
        }`}>
          GPS TRACKING
        </h3>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Background - Dark terrain style */}
        <div className={`absolute inset-0 ${
          isNightMode 
            ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900' 
            : 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
        }`}>
          {/* Topographic grid overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${isNightMode ? '#0ea5e9' : '#22c55e'} 1px, transparent 1px), linear-gradient(90deg, ${isNightMode ? '#0ea5e9' : '#22c55e'} 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
          
          {/* Diagonal accent lines for terrain effect */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${isNightMode ? '#0ea5e9' : '#22c55e'} 0px, transparent 2px, transparent 40px)`,
            }}
          />

          {/* Troops on map */}
          {showMultiple && troops.map((troop, index) => {
            const isSelected = troop.id === selectedTroopId;
            const pos = getRelativePosition(troop.lat, troop.lon);
            
            return (
              <div
                key={troop.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${Math.max(10, Math.min(90, pos.x))}%`, 
                  top: `${Math.max(10, Math.min(90, pos.y))}%` 
                }}
              >
                <div className="relative">
                  <MapPin
                    className={`w-6 h-6 drop-shadow-lg ${
                      isSelected
                        ? isNightMode ? 'text-cyan-400' : 'text-green-400'
                        : troop.status === 'active'
                          ? 'text-green-400'
                          : troop.status === 'standby'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                    } ${isSelected ? 'animate-pulse' : ''}`}
                  />
                  {/* Direction indicator */}
                  {troop.heading !== undefined && (
                    <Navigation 
                      className={`w-3 h-3 absolute -bottom-1 -right-1 ${
                        isSelected 
                          ? isNightMode ? 'text-cyan-400' : 'text-green-400'
                          : 'text-gray-400'
                      }`}
                      style={{ transform: `rotate(${troop.heading}deg)` }}
                    />
                  )}
                  {/* Tooltip on hover or selected */}
                  {isSelected && (
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 border ${
                      isNightMode ? 'border-cyan-400 bg-black text-cyan-400' : 'border-green-400 bg-black text-green-400'
                    } shadow-lg z-10`}>
                      {troop.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Single troop view */}
          {!showMultiple && selectedTroop && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <MapPin className={`w-10 h-10 animate-pulse drop-shadow-lg ${
                  isNightMode ? 'text-cyan-400' : 'text-green-400'
                }`} />
                <Navigation 
                  className={`w-5 h-5 absolute -bottom-1 -right-1 ${
                    isNightMode ? 'text-cyan-400' : 'text-green-400'
                  }`} 
                  style={{ transform: `rotate(${selectedTroop.heading || 0}deg)` }} 
                />
                {/* Pulse ring effect */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 rounded-full animate-ping ${
                  isNightMode ? 'border-cyan-400' : 'border-green-400'
                }`} style={{ animationDuration: '2s' }} />
              </div>
            </div>
          )}

          {/* Target markers */}
          {showTargets && mockTargets.map((target) => {
            const pos = getRelativePosition(target.lat, target.lon);
            const Icon = getTargetIcon(target);
            
            return (
              <div
                key={target.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ 
                  left: `${Math.max(10, Math.min(90, pos.x))}%`, 
                  top: `${Math.max(10, Math.min(90, pos.y))}%` 
                }}
              >
                <div className="relative">
                  {/* Target icon with pulsing border */}
                  <div className={`relative w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                    target.priority === 'high' ? 'animate-pulse' : ''
                  } ${
                    target.type === 'threat'
                      ? 'border-red-400 bg-red-950/50'
                      : target.type === 'objective'
                        ? isNightMode ? 'border-cyan-400 bg-cyan-950/50' : 'border-green-400 bg-green-950/50'
                        : 'border-yellow-400 bg-yellow-950/50'
                  }`}>
                    <Icon className={`w-4 h-4 ${getTargetColor(target)}`} />
                  </div>
                  
                  {/* Target label */}
                  <div className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-0.5 border ${
                    target.type === 'threat'
                      ? 'border-red-400 bg-black text-red-400'
                      : target.type === 'objective'
                        ? isNightMode ? 'border-cyan-400 bg-black text-cyan-400' : 'border-green-400 bg-black text-green-400'
                        : 'border-yellow-400 bg-black text-yellow-400'
                  } opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {target.name}
                  </div>
                  
                  {/* Priority indicator */}
                  {target.priority === 'high' && (
                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                      target.type === 'threat' ? 'bg-red-500' : 'bg-orange-500'
                    } animate-pulse`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button className={`p-1.5 border ${
            isNightMode ? 'border-cyan-400 bg-black/70 text-cyan-400' : 'border-green-400 bg-black/70 text-green-400'
          } hover:bg-white/10 transition-colors`}>
            <Plus className="w-4 h-4" />
          </button>
          <button className={`p-1.5 border ${
            isNightMode ? 'border-cyan-400 bg-black/70 text-cyan-400' : 'border-green-400 bg-black/70 text-green-400'
          } hover:bg-white/10 transition-colors`}>
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Map Legend */}
        {showTargets && (
          <div className={`absolute bottom-4 left-4 text-xs space-y-1 px-2 py-2 border ${
            isNightMode ? 'border-cyan-400/30 bg-black/80 text-cyan-400' : 'border-green-400/30 bg-black/80 text-green-400'
          } z-10`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span>Threat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>POI</span>
            </div>
          </div>
        )}
      </div>

      {/* Coordinates Panel */}
      <div className={`border-t px-4 py-3 space-y-1 text-xs ${
        isNightMode ? 'border-cyan-400/30 text-cyan-400' : 'border-green-400/30 text-green-400'
      }`}>
        {selectedTroop ? (
          <>
            <div className="flex justify-between">
              <span>LAT:</span>
              <span>{selectedTroop.lat.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between">
              <span>LON:</span>
              <span>{selectedTroop.lon.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between">
              <span>ALT:</span>
              <span>{selectedTroop.altitude || 1245}m</span>
            </div>
            <div className="flex justify-between">
              <span>HDG:</span>
              <span>{selectedTroop.heading?.toString().padStart(3, '0') || '000'}°</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span>AREA:</span>
              <span>LOS ANGELES</span>
            </div>
            <div className="flex justify-between">
              <span>ZOOM:</span>
              <span>12x</span>
            </div>
            <div className="flex justify-between">
              <span>TARGETS:</span>
              <span>{mockTargets.filter(t => t.status === 'active').length} ACTIVE</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
