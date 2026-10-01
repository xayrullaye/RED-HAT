import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle2, 
  FlaskConical, 
  Bookmark, 
  Terminal, 
  FileCode2, 
  Zap, 
  Lock,
  Cpu
} from 'lucide-react';
import { ActivePage, UserProfile, ModuleProgress } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  userProfile: UserProfile;
  progress: Record<number, ModuleProgress>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  userProfile,
  progress,
}) => {
  const completedCount = Object.values(progress).filter(p => p.isCompleted).length;

  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Asosiy Holat (Dashboard)', icon: LayoutDashboard, badge: null },
    { id: 'lessons' as ActivePage, label: "O'quv Modullari (1-6)", icon: BookOpen, badge: `${completedCount}/6` },
    { id: 'quiz' as ActivePage, label: 'Interaktiv Test & Imtihon', icon: Zap, badge: '80%+' },
    { id: 'lab' as ActivePage, label: 'Kiber Laboratoriya', icon: FlaskConical, badge: '5 Lab' },
    { id: 'bookmarks' as ActivePage, label: "Xatcho'plar", icon: Bookmark, badge: null },
    { id: 'python_code' as ActivePage, label: 'Python Desktop (.EXE)', icon: FileCode2, badge: 'PyQt6' },
  ];

  return (
    <aside className="w-64 md:w-72 bg-[#111927] border-r border-[#00E5FF]/20 flex flex-col justify-between h-screen shrink-0 select-none z-20">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-[#0A0E17] rounded-md border border-[#00FF66]/40 shadow-[0_0_12px_rgba(0,255,102,0.2)]">
              <Shield className="w-6 h-6 text-[#00FF66]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00FF66] rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00FF66] rounded-full" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-[#00E5FF] font-mono">
                KIBER AKADEMIYA
              </h1>
              <p className="text-[10px] tracking-widest text-[#00FF66] font-mono uppercase">
                CYBER HUD WORKSTATION
              </p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 mx-3 my-3 bg-[#0A0E17] border border-[#1E293B] rounded-md">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-mono text-[11px] truncate">{userProfile.fullname}</span>
            <span className="px-1.5 py-0.5 text-[9px] bg-[#00E5FF]/10 text-[#00E5FF] rounded border border-[#00E5FF]/30 font-mono">
              LVL {Math.floor(userProfile.xp / 300) + 1}
            </span>
          </div>
          <div className="text-xs text-[#00FF66] font-semibold font-mono truncate mb-2">
            {userProfile.rank}
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Tajriba:</span>
              <span className="text-[#00FF66] font-bold">{userProfile.xp} XP</span>
            </div>
            <div className="w-full bg-[#111927] h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-[#00E5FF] to-[#00FF66] h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userProfile.xp / 1500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono transition-all text-left ${
                  isActive
                    ? 'bg-[#00FF66]/10 text-[#00FF66] border-l-2 border-[#00FF66] shadow-[inset_0_0_10px_rgba(0,255,102,0.1)] font-semibold'
                    : 'text-slate-300 hover:bg-[#00E5FF]/5 hover:text-[#00E5FF] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00FF66]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    isActive 
                      ? 'border-[#00FF66]/40 text-[#00FF66] bg-[#00FF66]/10' 
                      : 'border-slate-800 text-slate-400 bg-[#0A0E17]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0A0E17]/60">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
            TIZIM: ONLAYN
          </span>
          <span className="text-[#00E5FF]">v1.0.0</span>
        </div>
        <div className="text-[9px] font-mono text-slate-500">
          Protokol: TLS 1.3 / Baza: SQLite3
        </div>
      </div>
    </aside>
  );
};
