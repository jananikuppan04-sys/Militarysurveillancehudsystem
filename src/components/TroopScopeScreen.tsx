import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, MapPin, Tag, Mic, MicOff, Circle } from 'lucide-react';
import { useNightMode } from '../App';
import Header from './Header';
import Footer from './Footer';
import GPSMap from './GPSMap';
import HealthPanel from './HealthPanel';
import { getTroopById, mockTroops } from '../lib/mockData';
import { Operator } from '../types/database';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TroopScopeScreenProps {
  troopId: string;
  operator: Operator;
  onBack: () => void;
  onLogout: () => void;
}

export default function TroopScopeScreen({ troopId, operator, onBack, onLogout }: TroopScopeScreenProps) {
  const { isNightMode } = useNightMode();
  const [isMicActive, setIsMicActive] = useState(false);
  const [missionTime, setMissionTime] = useState(3845); // seconds
  const [mode, setMode] = useState<'VIS' | 'MWIR' | 'THERMAL' | 'FUSION'>('THERMAL');
  
  const troop = getTroopById(troopId);

  // Mission timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMissionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMissionTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock health data with some variation
  const healthData = {
    heartRate: 82 + Math.floor(Math.random() * 10),
    bodyTemp: 36.8 + Math.random() * 0.4,
    bloodOxygen: 96 + Math.floor(Math.random() * 3),
    stress: 35 + Math.floor(Math.random() * 20),
    battery: 73,
    armorIntegrity: 88,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'standby':
        return 'text-yellow-400';
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const modes = ['VIS', 'MWIR', 'THERMAL', 'FUSION'] as const;

  if (!troop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Troop not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Operator Details */}
      <Header operator={operator} onLogout={onLogout} showSystemStats={false} />

      {/* Main Content */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-4">
        {/* Left Panel - GPS Mini Map */}
        <div className="col-span-3 h-[calc(100vh-200px)]">
          <GPSMap 
            troops={[troop]} 
            selectedTroopId={troopId}
            showMultiple={false}
            showTargets={true}
          />
        </div>

        {/* Center Panel - Full Screen Scope with Live Video */}
        <div className="col-span-6">
          <div className={`border relative ${
            isNightMode ? 'border-cyan-400/30 bg-black' : 'border-green-400/30 bg-black'
          }`}>
            {/* Full Scope Feed */}
            <div className="aspect-video relative bg-black overflow-hidden">
              {/* Live Video Feed */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={troop.videoFeedUrl}
                  alt={`${troop.name} scope view`}
                  className="w-full h-full object-cover opacity-70"
                />
                {/* Thermal/Night Vision overlay effect */}
                <div 
                  className={`absolute inset-0 mix-blend-color ${
                    mode === 'THERMAL' 
                      ? isNightMode ? 'bg-cyan-500/30' : 'bg-green-500/30'
                      : mode === 'MWIR'
                        ? 'bg-orange-500/20'
                        : mode === 'FUSION'
                          ? 'bg-purple-500/20'
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

              {/* Enhanced Crosshair with Target Lock */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-40 h-40">
                  {/* Rotating outer ring */}
                  <div className={`absolute inset-0 border-2 rounded-full animate-spin ${
                    isNightMode ? 'border-cyan-400/30' : 'border-green-400/30'
                  }`} style={{ animationDuration: '3s' }} />
                  
                  {/* Center circle */}
                  <Circle className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 ${
                    isNightMode ? 'text-cyan-400' : 'text-green-400'
                  }`} />
                  
                  {/* Crosshair lines */}
                  <div className={`absolute top-1/2 left-0 right-0 h-[2px] ${
                    isNightMode ? 'bg-cyan-400' : 'bg-green-400'
                  }`} />
                  <div className={`absolute top-0 bottom-0 left-1/2 w-[2px] ${
                    isNightMode ? 'bg-cyan-400' : 'bg-green-400'
                  }`} />
                  
                  {/* Corner brackets */}
                  <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${
                    isNightMode ? 'border-cyan-400' : 'border-green-400'
                  }`} />
                  <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${
                    isNightMode ? 'border-cyan-400' : 'border-green-400'
                  }`} />
                  <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${
                    isNightMode ? 'border-cyan-400' : 'border-green-400'
                  }`} />
                  <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${
                    isNightMode ? 'border-cyan-400' : 'border-green-400'
                  }`} />

                  {/* Target Lock Indicator */}
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 border ${
                    isNightMode ? 'border-cyan-400 bg-black/80 text-cyan-400' : 'border-green-400 bg-black/80 text-green-400'
                  }`}>
                    TARGET LOCKED
                  </div>
                </div>
              </div>

              {/* Top Left HUD */}
              <div className={`absolute top-4 left-4 space-y-2 text-xs bg-black/60 px-3 py-2 border z-10 ${
                isNightMode ? 'text-cyan-400 border-cyan-400/30' : 'text-green-400 border-green-400/30'
              }`}>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
                  <span>RECORDING - {troop.name}</span>
                </div>
                <div>RANGE: 2,847m</div>
                <div>ALTITUDE: {troop.altitude || 1245}m</div>
                <div>AZIMUTH: {troop.heading?.toString().padStart(3, '0') || '087'}°</div>
                <div>ELEVATION: +12°</div>
              </div>

              {/* Top Right HUD */}
              <div className={`absolute top-4 right-4 space-y-2 text-xs text-right bg-black/60 px-3 py-2 border z-10 ${
                isNightMode ? 'text-cyan-400 border-cyan-400/30' : 'text-green-400 border-green-400/30'
              }`}>
                <div>ZOOM: 8.5x</div>
                <div>FOV: 45°</div>
                <div>LRF: ACTIVE</div>
                <div>STAB: ON</div>
                <div>MODE: {mode}</div>
              </div>

              {/* Mode Buttons */}
              <div className={`absolute bottom-4 left-4 flex gap-2 text-xs z-10 ${
                isNightMode ? 'text-cyan-400' : 'text-green-400'
              }`}>
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
            </div>
          </div>
        </div>

        {/* Right Panel - Health Panel */}
        <div className="col-span-3 h-[calc(100vh-200px)]">
          <HealthPanel troopName={troop.name} data={healthData} />
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className={`border-t px-4 py-4 ${
        isNightMode ? 'border-cyan-400/30 bg-black/50' : 'border-green-400/30 bg-[#0a0e14]/50'
      }`}>
        <div className="flex items-center justify-between">
          {/* Left: Back Button */}
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 border transition-all ${
              isNightMode
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20'
                : 'border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">BACK TO DASHBOARD</span>
          </button>

          {/* Center: Troop Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Circle className={`w-3 h-3 fill-current ${getStatusColor(troop.status)}`} />
              <span className={`${isNightMode ? 'text-cyan-400' : 'text-green-400'}`}>
                {troop.name}
              </span>
            </div>
            <div className={`text-sm ${isNightMode ? 'text-cyan-400/70' : 'text-green-400/70'}`}>
              MISSION TIME: {formatMissionTime(missionTime)}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all ${
                isMicActive
                  ? isNightMode
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                    : 'border-green-400 bg-green-400/20 text-green-400'
                  : isNightMode
                    ? 'border-cyan-400/50 bg-black/50 text-cyan-400/70'
                    : 'border-green-400/50 bg-black/50 text-green-400/70'
              }`}
            >
              {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>COMMS</span>
            </button>

            <button className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all ${
              isNightMode
                ? 'border-cyan-400/50 bg-black/50 text-cyan-400 hover:bg-cyan-400/20'
                : 'border-green-400/50 bg-black/50 text-green-400 hover:bg-green-400/20'
            }`}>
              <Camera className="w-4 h-4" />
              <span>SCREENSHOT</span>
            </button>

            <button className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all ${
              isNightMode
                ? 'border-cyan-400/50 bg-black/50 text-cyan-400 hover:bg-cyan-400/20'
                : 'border-green-400/50 bg-black/50 text-green-400 hover:bg-green-400/20'
            }`}>
              <MapPin className="w-4 h-4" />
              <span>MARK TARGET</span>
            </button>

            <button className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all ${
              isNightMode
                ? 'border-cyan-400/50 bg-black/50 text-cyan-400 hover:bg-cyan-400/20'
                : 'border-green-400/50 bg-black/50 text-green-400 hover:bg-green-400/20'
            }`}>
              <Tag className="w-4 h-4" />
              <span>TAG LOCATION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
