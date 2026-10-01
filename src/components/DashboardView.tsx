import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Play, 
  Award, 
  Terminal, 
  Cpu, 
  Network, 
  GlobeLock, 
  ShieldAlert, 
  FileCode,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MODULES, ModuleData } from '../data/lessons';
import { ModuleProgress, UserProfile } from '../types';

interface DashboardViewProps {
  progress: Record<number, ModuleProgress>;
  userProfile: UserProfile;
  onOpenModule: (moduleId: number) => void;
  onStartQuiz: (moduleId: number) => void;
  onOpenPythonCode: () => void;
  onOpenLab: () => void;
}

const getModuleIcon = (id: number) => {
  switch (id) {
    case 1: return Cpu;
    case 2: return ShieldCheck;
    case 3: return Network;
    case 4: return GlobeLock;
    case 5: return ShieldAlert;
    case 6: return Award;
    default: return FileCode;
  }
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  userProfile,
  onOpenModule,
  onStartQuiz,
  onOpenPythonCode,
  onOpenLab,
}) => {
  const completedCount = Object.values(progress).filter(p => p.isCompleted).length;
  const overallPercentage = Math.round((completedCount / MODULES.length) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-lg bg-[#111927] border border-[#00E5FF]/30 p-6 box-glow-cyan">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-[#00E5FF]" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
            100% O'ZBEK TILIDAGI KIBERXAVFSIZLIK VA CS DASTURI
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-mono mb-2">
            Xush kelibsiz, <span className="text-[#00FF66]">{userProfile.fullname}</span>!
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-mono">
            Kompyuter arxitekturasi, xotira tuzilmasi, kriptografiya, tarmoq paketlari tahlili, OWASP Top 10 veb-zaifliklari 
            va tizimlar auditi bo'yicha to'liq o'quv dasturi. Har bir modul bo'yicha 80% dan yuqori natija ko'rsatib, 
            keyingi bosqichlarni oching!
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenModule(1)}
              className="px-4 py-2 bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0A0E17] font-bold text-xs rounded font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.4)] transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              1-Modulni Boshlash
            </button>
            <button
              onClick={onOpenLab}
              className="px-4 py-2 bg-[#0A0E17] hover:bg-[#111927] border border-[#00E5FF] text-[#00E5FF] font-bold text-xs rounded font-mono flex items-center gap-2 transition-all cursor-pointer"
            >
              Kiber Laboratoriyani Sinash
            </button>
            <button
              onClick={onOpenPythonCode}
              className="px-4 py-2 bg-[#0A0E17] hover:bg-[#111927] border border-[#FF0055] text-[#FF0055] font-bold text-xs rounded font-mono flex items-center gap-2 transition-all cursor-pointer"
            >
              PyQt6 Desktop (.EXE) Manbai
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111927] border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">O'quv Taraqqiyoti</div>
          <div className="text-2xl font-bold text-[#00FF66] font-mono">{overallPercentage}%</div>
          <div className="text-[11px] text-slate-500 font-mono">{completedCount}/6 modul yakunlandi</div>
        </div>

        <div className="bg-[#111927] border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">To'plangan Tajriba (XP)</div>
          <div className="text-2xl font-bold text-[#00E5FF] font-mono">{userProfile.xp}</div>
          <div className="text-[11px] text-slate-500 font-mono">Unvon: {userProfile.rank}</div>
        </div>

        <div className="bg-[#111927] border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">O'tish Talabi</div>
          <div className="text-2xl font-bold text-[#FF0055] font-mono">≥ 80%</div>
          <div className="text-[11px] text-slate-500 font-mono">Modul ochilishi uchun</div>
        </div>

        <div className="bg-[#111927] border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-mono mb-1">Platforma</div>
          <div className="text-2xl font-bold text-white font-mono">PyQt6 / Web</div>
          <div className="text-[11px] text-[#00FF66] font-mono">Windows .exe ga tayyor</div>
        </div>
      </div>

      {/* Modules List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider text-[#00E5FF] font-mono uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00E5FF] rounded-none rotate-45" />
            BOSQICHMA-BOSQICH O'QUV MODULLARI (1-6)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {completedCount} / 6 yakunlangan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map((mod) => {
            const p = progress[mod.id] || { isUnlocked: mod.id === 1, isCompleted: false, bestScore: 0 };
            const Icon = getModuleIcon(mod.id);
            const isUnlocked = p.isUnlocked;
            const isCompleted = p.isCompleted;

            return (
              <div
                key={mod.id}
                className={`p-5 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                  isUnlocked
                    ? isCompleted
                      ? 'bg-[#111927] border-[#00FF66]/50 shadow-[0_0_10px_rgba(0,255,102,0.15)]'
                      : 'bg-[#111927] border-[#00E5FF]/40 hover:border-[#00E5FF]'
                    : 'bg-[#0D131F] border-slate-800/80 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded border ${
                        isUnlocked
                          ? isCompleted
                            ? 'bg-[#00FF66]/10 border-[#00FF66]/40 text-[#00FF66]'
                            : 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                          MODUL 0{mod.id}
                        </span>
                        <h4 className={`text-sm font-bold font-mono ${
                          isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}>
                          {mod.title}
                        </h4>
                      </div>
                    </div>

                    {isUnlocked ? (
                      isCompleted ? (
                        <span className="flex items-center gap-1 text-[10px] text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded border border-[#00FF66]/30 font-mono shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          O'TILGAN ({p.bestScore.toFixed(0)}%)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30 font-mono shrink-0">
                          <Unlock className="w-3 h-3" />
                          OCHIQ
                        </span>
                      )
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono shrink-0">
                        <Lock className="w-3 h-3" />
                        QULFLANGAN
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-mono line-clamp-2 my-2 leading-relaxed">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400">
                    Eng yuqori ball: <span className="text-[#00FF66] font-bold">{p.bestScore.toFixed(0)}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!isUnlocked}
                      onClick={() => onOpenModule(mod.id)}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                        isUnlocked
                          ? 'bg-[#0A0E17] hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 cursor-pointer'
                          : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      Darsni O'qish
                    </button>
                    <button
                      disabled={!isUnlocked}
                      onClick={() => onStartQuiz(mod.id)}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        isUnlocked
                          ? 'bg-[#00FF66]/20 hover:bg-[#00FF66] text-[#00FF66] hover:text-[#0A0E17] border border-[#00FF66] cursor-pointer'
                          : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      Test Topshirish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
