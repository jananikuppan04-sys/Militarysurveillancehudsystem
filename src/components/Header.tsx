import { Clock, Wifi, Battery, Cpu, Activity, LogOut, User, Shield } from 'lucide-react';
import { useNightMode } from '../App';
import NightModeToggle from './NightModeToggle';
import { useState, useEffect } from 'react';
import { Operator } from '../types/database';

interface HeaderProps {
  operator: Operator;
  onLogout?: () => void;
  showSystemStats?: boolean; // Show system stats (dashboard) or operator details (scope)
}

export default function Header({ operator, onLogout, showSystemStats = true }: HeaderProps) {
  const { isNightMode } = useNightMode();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`border-b px-4 py-3 ${
      isNightMode ? 'border-cyan-400/30 bg-black/50' : 'border-green-400/30 bg-[#0a0e14]/50'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left: Title and Operator Info */}
        <div className={`${isNightMode ? 'text-cyan-400' : 'text-green-400'}`}>
          <h1 className="tracking-wider">
            NSG - 25196 | ALPHA UNIT | SURVEILLANCE SCOPE SYSTEM
          </h1>
          <div className="flex items-center gap-4 mt-1 text-xs opacity-90">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              <span>OPERATOR: {operator.username.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              <span>DESIGNATION: {operator.designation.toUpperCase()}</span>
            </div>
            <div>
              <span>POSITION: {operator.position.toUpperCase()}</span>
            </div>
            {operator.rank && (
              <div>
                <span>RANK: {operator.rank.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: System Stats or Simple Controls */}
        <div className="flex items-center gap-4">
          {showSystemStats ? (
            /* Dashboard Mode - Show System Stats */
            <>
              <div className={`flex items-center gap-4 text-xs ${
                isNightMode ? 'text-cyan-400' : 'text-green-400'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(time)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-4 h-4" />
                  <span>ONLINE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Battery className="w-4 h-4" />
                  <span>87%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>42°C</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>23ms</span>
                </div>
              </div>
            </>
          ) : (
            /* Scope Mode - Just show time */
            <div className={`flex items-center gap-4 text-xs ${
              isNightMode ? 'text-cyan-400' : 'text-green-400'
            }`}>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatTime(time)}</span>
              </div>
            </div>
          )}

          {/* Night Mode Indicator */}
          {isNightMode && (
            <div className={`text-xs px-2 py-1 border ${
              isNightMode ? 'border-cyan-400/50 text-cyan-400' : 'border-green-400/50 text-green-400'
            }`}>
              NIGHT MODE: ACTIVE
            </div>
          )}
          
          {/* Night Mode Toggle */}
          <NightModeToggle />

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${
                isNightMode
                  ? 'border-red-400 bg-red-950/30 text-red-400 hover:bg-red-950/50'
                  : 'border-red-400 bg-red-950/30 text-red-400 hover:bg-red-950/50'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">LOGOUT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
