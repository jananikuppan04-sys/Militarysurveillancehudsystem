import { Heart, Thermometer, Activity, AlertTriangle, Battery, Shield } from 'lucide-react';
import { useNightMode } from '../App';

interface HealthData {
  heartRate: number;
  bodyTemp: number;
  bloodOxygen: number;
  stress: number;
  battery: number;
  armorIntegrity: number;
}

interface HealthPanelProps {
  troopName: string;
  data: HealthData;
}

export default function HealthPanel({ troopName, data }: HealthPanelProps) {
  const { isNightMode } = useNightMode();

  const getStatusColor = (value: number, threshold: number, inverse = false) => {
    if (inverse) {
      return value > threshold ? 'text-red-400' : 'text-green-400';
    }
    return value < threshold ? 'text-red-400' : value < threshold + 10 ? 'text-yellow-400' : 'text-green-400';
  };

  const getBarColor = (value: number, threshold: number, inverse = false) => {
    if (inverse) {
      return value > threshold ? 'bg-red-400' : 'bg-green-400';
    }
    return value < threshold ? 'bg-red-400' : value < threshold + 10 ? 'bg-yellow-400' : 'bg-green-400';
  };

  const stats = [
    {
      icon: Heart,
      label: 'HEART RATE',
      value: `${data.heartRate} BPM`,
      percentage: Math.min((data.heartRate / 200) * 100, 100),
      status: getStatusColor(data.heartRate, 60, true),
      barColor: data.heartRate > 120 ? 'bg-red-400' : 'bg-green-400',
      critical: data.heartRate > 120 || data.heartRate < 50,
    },
    {
      icon: Thermometer,
      label: 'BODY TEMP',
      value: `${data.bodyTemp}°C`,
      percentage: ((data.bodyTemp - 35) / (40 - 35)) * 100,
      status: getStatusColor(data.bodyTemp * 10, 365),
      barColor: data.bodyTemp > 38 ? 'bg-red-400' : 'bg-green-400',
      critical: data.bodyTemp > 38.5,
    },
    {
      icon: Activity,
      label: 'BLOOD O₂',
      value: `${data.bloodOxygen}%`,
      percentage: data.bloodOxygen,
      status: getStatusColor(data.bloodOxygen, 90),
      barColor: getBarColor(data.bloodOxygen, 90),
      critical: data.bloodOxygen < 90,
    },
    {
      icon: AlertTriangle,
      label: 'STRESS',
      value: `${data.stress}%`,
      percentage: data.stress,
      status: getStatusColor(data.stress, 70, true),
      barColor: data.stress > 70 ? 'bg-red-400' : data.stress > 50 ? 'bg-yellow-400' : 'bg-green-400',
      critical: data.stress > 80,
    },
    {
      icon: Battery,
      label: 'WEARABLE',
      value: `${data.battery}%`,
      percentage: data.battery,
      status: getStatusColor(data.battery, 20),
      barColor: getBarColor(data.battery, 20),
      critical: data.battery < 20,
    },
    {
      icon: Shield,
      label: 'ARMOR',
      value: `${data.armorIntegrity}%`,
      percentage: data.armorIntegrity,
      status: getStatusColor(data.armorIntegrity, 50),
      barColor: getBarColor(data.armorIntegrity, 50),
      critical: data.armorIntegrity < 50,
    },
  ];

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
          VITALS - {troopName}
        </h3>
      </div>

      {/* Stats List */}
      <div className="flex-1 overflow-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`px-4 py-4 border-b ${
                isNightMode ? 'border-cyan-400/20' : 'border-green-400/20'
              } ${stat.critical ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.status}`} />
                  <span className={`text-xs ${
                    isNightMode ? 'text-cyan-400' : 'text-green-400'
                  }`}>
                    {stat.label}
                  </span>
                </div>
                <span className={`text-sm ${stat.status}`}>
                  {stat.value}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className={`w-full h-1.5 ${
                isNightMode ? 'bg-cyan-950/50' : 'bg-green-950/50'
              }`}>
                <div
                  className={`h-full ${stat.barColor} transition-all duration-500`}
                  style={{ width: `${Math.max(0, Math.min(100, stat.percentage))}%` }}
                />
              </div>

              {/* Critical Warning */}
              {stat.critical && (
                <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>CRITICAL</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
