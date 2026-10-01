import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { TerminalLog } from '../types';

interface MiniTerminalProps {
  logs: TerminalLog[];
  onCommand: (command: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MiniTerminal: React.FC<MiniTerminalProps> = ({
  logs,
  onCommand,
  onClear,
  isOpen,
  onClose,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onCommand(inputVal.trim());
    setInputVal('');
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'DANGER':
      case 'SECURITY':
      case 'ERROR':
        return 'text-[#FF0055] border-[#FF0055]/40 bg-[#FF0055]/10';
      case 'LEARN':
      case 'LAB':
        return 'text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/10';
      case 'SYSTEM':
      default:
        return 'text-[#00FF66] border-[#00FF66]/40 bg-[#00FF66]/10';
    }
  };

  return (
    <div
      className={`border-t border-[#00FF66]/30 bg-[#05080E] font-mono flex flex-col transition-all duration-300 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.8)] ${
        isExpanded ? 'h-80' : 'h-48'
      }`}
    >
      {/* Header bar */}
      <div className="h-8 bg-[#0A0E17] border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2 text-[#00FF66]">
          <TerminalIcon className="w-3.5 h-3.5" />
          <span className="font-bold text-[11px] tracking-wider">
            MINI-TERMINAL HUD // KONSOL VA TIZIM JURNALI
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            (Buyruqlar: 'help', 'status', 'modules', 'scan', 'clear')
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            title="Terminalni tozalash"
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Kichiklashtirish" : "Kengaytirish"}
            className="p-1 text-slate-400 hover:text-[#00E5FF] rounded hover:bg-slate-800"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            title="Terminalni yopish"
            className="p-1 text-slate-400 hover:text-[#FF0055] rounded hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log list */}
      <div
        ref={scrollRef}
        className="flex-1 p-2.5 overflow-y-auto space-y-1 text-xs select-text text-slate-300 scroll-smooth font-mono"
      >
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed flex items-start gap-2">
            <span className="text-slate-600 text-[10px] shrink-0 select-none">[{log.timestamp}]</span>
            <span
              className={`px-1 py-0.2 rounded border text-[9px] font-bold shrink-0 ${getBadgeColor(
                log.level
              )}`}
            >
              {log.level}
            </span>
            <span className="break-all whitespace-pre-wrap">{log.message}</span>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="h-9 border-t border-slate-800 bg-[#0A0E17] flex items-center px-3 gap-2"
      >
        <span className="text-[#00E5FF] text-xs font-bold shrink-0 select-none">
          root@kiber-hud:~#
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Buyruq yozing... (masalan: 'help', 'scan', 'modules')"
          className="flex-1 bg-transparent border-none outline-none text-xs text-[#00FF66] placeholder:text-slate-600 font-mono caret-[#00FF66]"
        />
        <button
          type="submit"
          className="text-[10px] text-[#00E5FF] hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700"
        >
          ENTER
        </button>
      </form>
    </div>
  );
};
