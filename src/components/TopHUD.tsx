import React, { useState, useEffect } from 'react';
import { ShieldAlert, Cpu, Radio, Clock, Award, Terminal } from 'lucide-react';
import { UserProfile, ModuleProgress } from '../types';

interface TopHUDProps {
  userProfile: UserProfile;
  progress: Record<number, ModuleProgress>;
  toggleTerminal: () => void;
  isTerminalOpen: boolean;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  userProfile,
  progress,
  toggleTerminal,
  isTerminalOpen,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const unlockedCount = Object.values(progress).filter(p => p.isUnlocked).length;

  return (
    <header className="h-12 bg-[#111927] border-b border-[#00E5FF]/20 px-4 flex items-center justify-between text-xs font-mono select-none">
      {/* Left indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[#00E5FF]">
          <Radio className="w-3.5 h-3.5 text-[#00FF66] animate-pulse" />
          <span className="font-bold tracking-wider">// KIBER TAHLIL MARKAZI</span>
        </div>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-400">Ochiq Modullar:</span>
          <span className="text-[#00FF66] font-bold">{unlockedCount}/6</span>
        </div>
      </div>

      {/* Right indicators */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="text-slate-300">{time}</span>
        </div>

        {/* Terminal Toggle Button */}
        <button
          onClick={toggleTerminal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition-all ${
            isTerminalOpen
              ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]'
              : 'bg-[#0A0E17] border-slate-700 text-slate-400 hover:border-[#00E5FF] hover:text-[#00E5FF]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mini-Terminal HUD</span>
        </button>
      </div>
    </header>
  );
};
