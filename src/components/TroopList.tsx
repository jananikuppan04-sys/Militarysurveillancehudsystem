import { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { useNightMode } from '../App';
import { Troop } from '../types/database';

interface TroopListProps {
  troops: Troop[];
  onSelectTroop: (troopId: string) => void;
}

export default function TroopList({ troops, onSelectTroop }: TroopListProps) {
  const { isNightMode } = useNightMode();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  const visibleTroops = troops.slice(currentIndex, currentIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - itemsPerPage));
    }
  };

  const handleNext = () => {
    if (currentIndex + itemsPerPage < troops.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
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
          TROOP ROSTER
        </h3>
      </div>

      {/* Troop List */}
      <div className="flex-1 overflow-hidden">
        {visibleTroops.map((troop) => (
          <button
            key={troop.id}
            onClick={() => onSelectTroop(troop.id)}
            className={`w-full px-4 py-3 border-b text-left hover:bg-white/5 transition-colors ${
              isNightMode ? 'border-cyan-400/20' : 'border-green-400/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle
                  className={`w-2 h-2 fill-current ${getStatusColor(troop.status)}`}
                />
                <span className={`text-sm ${
                  isNightMode ? 'text-cyan-400' : 'text-green-400'
                }`}>
                  {troop.name}
                </span>
              </div>
              <span className="text-xs text-gray-400 uppercase">{troop.status}</span>
            </div>
            <div className="mt-1 ml-5 text-xs text-gray-500">
              Last ping: {troop.lastPing}
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className={`border-t px-4 py-2 flex items-center justify-between ${
        isNightMode ? 'border-cyan-400/30' : 'border-green-400/30'
      }`}>
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`p-1 disabled:opacity-30 disabled:cursor-not-allowed ${
            isNightMode ? 'text-cyan-400' : 'text-green-400'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className={`text-xs ${
          isNightMode ? 'text-cyan-400/70' : 'text-green-400/70'
        }`}>
          {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, troops.length)} of {troops.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex + itemsPerPage >= troops.length}
          className={`p-1 disabled:opacity-30 disabled:cursor-not-allowed ${
            isNightMode ? 'text-cyan-400' : 'text-green-400'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}