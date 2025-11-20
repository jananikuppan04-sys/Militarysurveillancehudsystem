import { useState } from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';
import { useNightMode } from '../App';
import Header from './Header';
import Footer from './Footer';
import TroopList from './TroopList';
import LiveFeed from './LiveFeed';
import GPSMap from './GPSMap';
import { mockTroops } from '../lib/mockData';
import { Operator } from '../types/database';

interface DashboardScreenProps {
  operator: Operator;
  onLogout: () => void;
  onSelectTroop: (troopId: string) => void;
}

export default function DashboardScreen({ operator, onLogout, onSelectTroop }: DashboardScreenProps) {
  const { isNightMode } = useNightMode();
  const [commsMode, setCommsMode] = useState<'individual' | 'broadcast'>('individual');
  const [isMicActive, setIsMicActive] = useState(false);
  const [selectedTroopForMap, setSelectedTroopForMap] = useState<string | null>(mockTroops[0].id);

  const handleTroopSelect = (troopId: string) => {
    setSelectedTroopForMap(troopId);
  };

  const handleTroopView = (troopId: string) => {
    onSelectTroop(troopId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header operator={operator} onLogout={onLogout} showSystemStats={true} />

      {/* Main Content */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-4">
        {/* Left Panel - Troop List */}
        <div className="col-span-3 h-[calc(100vh-200px)]">
          <TroopList troops={mockTroops} onSelectTroop={handleTroopView} />
        </div>

        {/* Center Panel - Live Feed with Troop Cycling */}
        <div className="col-span-6">
          <LiveFeed 
            title="LIVE TELECAST" 
            showModeToggle={true} 
            showNavigation={true}
            onTroopChange={handleTroopSelect}
          />
        </div>

        {/* Right Panel - GPS Map */}
        <div className="col-span-3 h-[calc(100vh-200px)]">
          <GPSMap 
            troops={mockTroops} 
            selectedTroopId={selectedTroopForMap} 
            showMultiple={true}
            showTargets={true}
          />
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className={`border-t px-4 py-4 ${
        isNightMode ? 'border-cyan-400/30 bg-black/50' : 'border-green-400/30 bg-[#0a0e14]/50'
      }`}>
        <div className="flex items-center justify-between">
          {/* Left: Tap to Speak */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className={`flex items-center gap-3 px-4 py-2 border transition-all ${
                isMicActive
                  ? isNightMode
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                    : 'border-green-400 bg-green-400/20 text-green-400'
                  : isNightMode
                    ? 'border-cyan-400/50 bg-black/50 text-cyan-400/70'
                    : 'border-green-400/50 bg-black/50 text-green-400/70'
              }`}
            >
              {isMicActive ? (
                <Mic className="w-5 h-5 animate-pulse" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
              <span className="text-sm">TAP TO SPEAK</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setCommsMode('individual')}
                className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all ${
                  commsMode === 'individual'
                    ? isNightMode
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                      : 'border-green-400 bg-green-400/20 text-green-400'
                    : isNightMode
                      ? 'border-cyan-400/30 bg-black/30 text-cyan-400/50'
                      : 'border-green-400/30 bg-black/30 text-green-400/50'
                }`}
              >
                <Radio className="w-4 h-4" />
                INDIVIDUAL
              </button>
              <button
                onClick={() => setCommsMode('broadcast')}
                className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all ${
                  commsMode === 'broadcast'
                    ? isNightMode
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                      : 'border-green-400 bg-green-400/20 text-green-400'
                    : isNightMode
                      ? 'border-cyan-400/30 bg-black/30 text-cyan-400/50'
                      : 'border-green-400/30 bg-black/30 text-green-400/50'
                }`}
              >
                <Radio className="w-4 h-4" />
                BROADCAST
              </button>
            </div>
          </div>

          {/* Right: Troop Status Grid */}
          <div className="flex items-center gap-6">
            {mockTroops.slice(0, 4).map((troop) => (
              <div key={troop.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  troop.status === 'active'
                    ? 'bg-green-400'
                    : troop.status === 'standby'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                }`} />
                <span className={`text-xs ${
                  isNightMode ? 'text-cyan-400' : 'text-green-400'
                }`}>
                  {troop.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}