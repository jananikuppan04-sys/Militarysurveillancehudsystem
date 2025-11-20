import { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle, Video } from 'lucide-react';
import { useNightMode } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockTroops } from '../lib/mockData';

interface LiveFeedProps {
  title?: string;
  showModeToggle?: boolean;
  showNavigation?: boolean;
  fixedTroopId?: string;
  onTroopChange?: (troopId: string) => void;
}

export default function LiveFeed({ 
  title = 'LIVE TELECAST', 
  showModeToggle = true, 
  showNavigation = true,
  fixedTroopId,
  onTroopChange
}: LiveFeedProps) {
  const { isNightMode } = useNightMode();
  const [mode, setMode] = useState<'VIS' | 'MWIR' | 'THERMAL' | 'FUSION'>('THERMAL');
  const [currentTroopIndex, setCurrentTroopIndex] = useState(0);

  const modes = ['VIS', 'MWIR', 'THERMAL', 'FUSION'] as const;
  
  // Filter only active troops for cycling
  const activeTroops = mockTroops.filter(t => t.status === 'active');
  const currentTroop = fixedTroopId 
    ? mockTroops.find(t => t.id === fixedTroopId) || activeTroops[0]
    : activeTroops[currentTroopIndex];

  const handlePrevious = () => {
    if (!fixedTroopId && activeTroops.length > 0) {
      const newIndex = currentTroopIndex === 0 ? activeTroops.length - 1 : currentTroopIndex - 1;
      setCurrentTroopIndex(newIndex);
      if (onTroopChange) {
        onTroopChange(activeTroops[newIndex].id);
      }
    }
  };

  const handleNext = () => {
    if (!fixedTroopId && activeTroops.length > 0) {
      const newIndex = (currentTroopIndex + 1) % activeTroops.length;
      setCurrentTroopIndex(newIndex);
      if (onTroopChange) {
        onTroopChange(activeTroops[newIndex].id);
      }
    }
  };

  return (
    <div className={`border relative ${
      isNightMode ? 'border-cyan-400/30 bg-black' : 'border-green-400/30 bg-black'
    }`}>
      {/* Feed Background with Video/Image */}
      <div className="aspect-video relative bg-black overflow-hidden">
        {/* Live Video Feed */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={currentTroop.videoFeedUrl}
            alt={`${currentTroop.name} feed`}
            className="w-full h-full object-cover opacity-80"
          />
          {/* Thermal/Night Vision overlay effect */}
          <div 
            className={`absolute inset-0 mix-blend-color ${
              mode === 'THERMAL' 
                ? isNightMode ? 'bg-cyan-500/20' : 'bg-green-500/20'
                : mode === 'MWIR'
                  ? 'bg-orange-500/15'
                  : mode === 'FUSION'
                    ? 'bg-purple-500/15'
                    : 'bg-transparent'
            }`}
          />
        </div>

        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${isNightMode ? '#0ea5e9' : '#22c55e'} 1px, transparent 1px), linear-gradient(90deg, ${isNightMode ? '#0ea5e9' : '#22c55e'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-32 h-32">
            {/* Center circle */}
            <Circle className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 ${
              isNightMode ? 'text-cyan-400' : 'text-green-400'
            }`} />
            {/* Crosshair lines */}
            <div className={`absolute top-1/2 left-0 right-0 h-[1px] ${
              isNightMode ? 'bg-cyan-400' : 'bg-green-400'
            }`} />
            <div className={`absolute top-0 bottom-0 left-1/2 w-[1px] ${
              isNightMode ? 'bg-cyan-400' : 'bg-green-400'
            }`} />
            {/* Corner brackets */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
              isNightMode ? 'border-cyan-400' : 'border-green-400'
            }`} />
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
              isNightMode ? 'border-cyan-400' : 'border-green-400'
            }`} />
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
              isNightMode ? 'border-cyan-400' : 'border-green-400'
            }`} />
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
              isNightMode ? 'border-cyan-400' : 'border-green-400'
            }`} />
          </div>
        </div>

        {/* Top HUD Info */}
        <div className={`absolute top-4 left-4 right-4 flex items-start justify-between text-xs ${
          isNightMode ? 'text-cyan-400' : 'text-green-400'
        } z-10`}>
          <div className="space-y-1 bg-black/60 px-3 py-2 border border-current/30">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>{title} - {currentTroop.name}</span>
            </div>
            <div>RANGE: 2,847m</div>
            <div>ALTITUDE: {currentTroop.altitude || 1245}m</div>
          </div>
          <div className="space-y-1 text-right bg-black/60 px-3 py-2 border border-current/30">
            <div>AZIMUTH: {currentTroop.heading?.toString().padStart(3, '0') || '087'}°</div>
            <div>ELEVATION: +12°</div>
            <div className="flex items-center justify-end gap-1">
              <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
              <span>REC</span>
            </div>
          </div>
        </div>

        {/* Troop Indicator */}
        {!fixedTroopId && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 border ${
            isNightMode 
              ? 'border-cyan-400 bg-black/80 text-cyan-400' 
              : 'border-green-400 bg-black/80 text-green-400'
          } z-10`}>
            TROOP {currentTroopIndex + 1}/{activeTroops.length}
          </div>
        )}

        {/* Picture-in-Picture */}
        <div className={`absolute bottom-4 right-4 w-32 h-24 border ${
          isNightMode ? 'border-cyan-400' : 'border-green-400'
        } bg-black overflow-hidden z-10`}>
          <ImageWithFallback
            src={currentTroop.thumbnailUrl || currentTroop.videoFeedUrl}
            alt="PiP"
            className="w-full h-full object-cover opacity-60"
          />
          <div className={`absolute inset-0 flex items-center justify-center text-xs ${
            isNightMode ? 'text-cyan-400' : 'text-green-400'
          }`}>
            <span>PiP</span>
          </div>
        </div>

        {/* Mode Buttons */}
        {showModeToggle && (
          <div className={`absolute bottom-4 left-4 flex gap-2 text-xs ${
            isNightMode ? 'text-cyan-400' : 'text-green-400'
          } z-10`}>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 border transition-all ${
                  mode === m
                    ? isNightMode
                      ? 'border-cyan-400 bg-cyan-400/20'
                      : 'border-green-400 bg-green-400/20'
                    : isNightMode
                      ? 'border-cyan-400/50 bg-black/80'
                      : 'border-green-400/50 bg-black/80'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {showNavigation && !fixedTroopId && (
          <>
            <button 
              onClick={handlePrevious}
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 ${
                isNightMode ? 'text-cyan-400 bg-black/60' : 'text-green-400 bg-black/60'
              } hover:bg-white/10 transition-colors border ${
                isNightMode ? 'border-cyan-400/50' : 'border-green-400/50'
              } z-10`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${
                isNightMode ? 'text-cyan-400 bg-black/60' : 'text-green-400 bg-black/60'
              } hover:bg-white/10 transition-colors border ${
                isNightMode ? 'border-cyan-400/50' : 'border-green-400/50'
              } z-10`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
