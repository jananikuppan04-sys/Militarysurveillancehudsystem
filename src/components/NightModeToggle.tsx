import { Moon, Sun } from 'lucide-react';
import { useNightMode } from '../App';

export default function NightModeToggle() {
  const { isNightMode, toggleNightMode } = useNightMode();

  return (
    <button
      onClick={toggleNightMode}
      className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${
        isNightMode
          ? 'border-cyan-400 bg-cyan-950/30 text-cyan-400'
          : 'border-green-400 bg-green-950/30 text-green-400'
      }`}
    >
      {isNightMode ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-xs">NIGHT</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-xs">DAY</span>
        </>
      )}
    </button>
  );
}
