import { useState } from 'react';
import { Lock, User, Shield } from 'lucide-react';
import { useNightMode } from '../App';
import NightModeToggle from './NightModeToggle';
import Footer from './Footer';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const { isNightMode } = useNightMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  const primaryColor = isNightMode ? 'cyan' : 'green';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(${isNightMode ? '#0ea5e9' : '#22c55e'} 1px, transparent 1px), linear-gradient(90deg, ${isNightMode ? '#0ea5e9' : '#22c55e'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Night Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <NightModeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className={`w-full max-w-md mx-4 border-2 p-8 backdrop-blur-sm shadow-2xl ${
          isNightMode 
            ? 'border-cyan-400 bg-black/80 shadow-cyan-400/20' 
            : 'border-green-400 bg-[#0a0e14]/80 shadow-green-400/20'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 border-2 mb-4 ${
              isNightMode ? 'border-cyan-400' : 'border-green-400'
            }`}>
              <Shield className={`w-10 h-10 ${isNightMode ? 'text-cyan-400' : 'text-green-400'}`} />
            </div>
            <h1 className={`text-2xl tracking-wider mb-2 ${
              isNightMode ? 'text-cyan-400' : 'text-green-400'
            }`}>
              SECURE ACCESS
            </h1>
            <p className={`text-xs ${isNightMode ? 'text-cyan-400/70' : 'text-green-400/70'}`}>
              NSG - 25196 | SURVEILLANCE SCOPE SYSTEM
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-xs mb-2 ${
                isNightMode ? 'text-cyan-400' : 'text-green-400'
              }`}>
                USERNAME
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isNightMode ? 'text-cyan-400' : 'text-green-400'
                }`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-black/50 border pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                    isNightMode
                      ? 'border-cyan-400/50 text-cyan-400 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-green-400/50 text-green-400 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                  }`}
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs mb-2 ${
                isNightMode ? 'text-cyan-400' : 'text-green-400'
              }`}>
                PASSWORD
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isNightMode ? 'text-cyan-400' : 'text-green-400'
                }`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-black/50 border pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                    isNightMode
                      ? 'border-cyan-400/50 text-cyan-400 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-green-400/50 text-green-400 focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                  }`}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 border-2 transition-all ${
                isNightMode
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]'
              }`}
            >
              LOGIN
            </button>
          </form>

          {/* Footer Info */}
          <div className={`mt-6 text-center text-xs ${
            isNightMode ? 'text-cyan-400/60' : 'text-green-400/60'
          }`}>
            <p>Military Access Only — Encrypted Channel v4.9</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
