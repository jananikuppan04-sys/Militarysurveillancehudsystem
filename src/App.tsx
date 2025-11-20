import { useState, createContext, useContext } from 'react';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import TroopScopeScreen from './components/TroopScopeScreen';
import { getOperatorByUsername } from './lib/mockData';
import { Operator } from './types/database';

type Screen = 'login' | 'dashboard' | 'troop-scope';

interface NightModeContextType {
  isNightMode: boolean;
  toggleNightMode: () => void;
}

const NightModeContext = createContext<NightModeContextType>({
  isNightMode: false,
  toggleNightMode: () => {},
});

export const useNightMode = () => useContext(NightModeContext);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isNightMode, setIsNightMode] = useState(false);
  const [selectedTroop, setSelectedTroop] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);

  const toggleNightMode = () => setIsNightMode(!isNightMode);

  const handleLogin = (username: string) => {
    const operatorData = getOperatorByUsername(username);
    setOperator(operatorData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setOperator(null);
    setSelectedTroop(null);
  };

  const handleSelectTroop = (troopId: string) => {
    setSelectedTroop(troopId);
    setCurrentScreen('troop-scope');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setSelectedTroop(null);
  };

  return (
    <NightModeContext.Provider value={{ isNightMode, toggleNightMode }}>
      <div className={`min-h-screen ${isNightMode ? 'bg-black' : 'bg-[#0a0e14]'} transition-colors duration-300`}>
        {currentScreen === 'login' && (
          <LoginScreen onLogin={handleLogin} />
        )}
        {currentScreen === 'dashboard' && operator && (
          <DashboardScreen 
            operator={operator}
            onLogout={handleLogout}
            onSelectTroop={handleSelectTroop}
          />
        )}
        {currentScreen === 'troop-scope' && selectedTroop && operator && (
          <TroopScopeScreen 
            troopId={selectedTroop}
            operator={operator}
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
          />
        )}
      </div>
    </NightModeContext.Provider>
  );
}