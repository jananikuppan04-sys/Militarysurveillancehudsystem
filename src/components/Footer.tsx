import { useNightMode } from '../App';

export default function Footer() {
  const { isNightMode } = useNightMode();

  return (
    <div className={`border-t py-2 px-4 text-center ${
      isNightMode ? 'border-cyan-900/50 text-cyan-400/60' : 'border-green-900/50 text-green-400/60'
    }`}>
      <p className="text-xs">© 2025 Tactical Surveillance Systems. All Rights Reserved.</p>
    </div>
  );
}
