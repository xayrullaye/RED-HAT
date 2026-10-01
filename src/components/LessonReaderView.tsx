import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Bookmark, 
  Check, 
  Copy, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Zap, 
  Code,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { MODULES, ModuleData, Topic } from '../data/lessons';
import { ModuleProgress } from '../types';

interface LessonReaderViewProps {
  currentModuleId: number;
  onSelectModule: (id: number) => void;
  progress: Record<number, ModuleProgress>;
  onBookmark: (moduleId: number, topicTitle: string) => void;
  onStartQuiz: (moduleId: number) => void;
  logAction: (level: any, msg: string) => void;
}

export const LessonReaderView: React.FC<LessonReaderViewProps> = ({
  currentModuleId,
  onSelectModule,
  progress,
  onBookmark,
  onStartQuiz,
  logAction,
}) => {
  const currentModule = MODULES.find((m) => m.id === currentModuleId) || MODULES[0];
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const topic: Topic = currentModule.topics[currentTopicIndex] || currentModule.topics[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    logAction('LEARN', `Kod nusxalandi: ${topic.title}`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleBookmark = () => {
    onBookmark(currentModule.id, topic.title);
    setBookmarked(true);
    setTimeout(() => setBookmarked(false), 2000);
  };

  const handleSelectTopic = (index: number) => {
    setCurrentTopicIndex(index);
    logAction('LEARN', `Mavzu ochildi: ${currentModule.topics[index].title}`);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-[#111927] border border-[#00E5FF]/20 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-mono">Modulni Tanlang:</label>
          <select
            value={currentModuleId}
            onChange={(e) => {
              const mid = Number(e.target.value);
              onSelectModule(mid);
              setCurrentTopicIndex(0);
            }}
            className="bg-[#0A0E17] text-[#00E5FF] border border-[#00E5FF]/40 rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00FF66]"
          >
            {MODULES.map((m) => {
              const p = progress[m.id];
              const isUnlocked = p ? p.isUnlocked : m.id === 1;
              return (
                <option key={m.id} value={m.id} disabled={!isUnlocked}>
                  {m.id}-Modul: {m.title} {isUnlocked ? '' : '🔒 (Qulflangan)'}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-all ${
              bookmarked
                ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]'
                : 'bg-[#0A0E17] border-slate-700 text-slate-300 hover:border-[#00E5FF] hover:text-[#00E5FF]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{bookmarked ? "Saqlandi!" : "Xatcho'pga Saqlash"}</span>
          </button>

          <a
            href={currentModule.video_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logAction('MEDIA', `YouTube video ochildi: ${currentModule.video_title}`)}
            className="px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 bg-[#0A0E17] border border-[#00E5FF]/60 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>YouTube Video Dars</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={() => onStartQuiz(currentModule.id)}
            className="px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0A0E17] font-bold shadow-[0_0_10px_rgba(0,255,102,0.3)] transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Modul Testi</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar topics + Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Topics List Column */}
        <div className="lg:col-span-1 bg-[#111927] border border-[#1E293B] rounded-lg p-3 space-y-2 h-fit">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800">
            Modul Mavzulari:
          </div>
          {currentModule.topics.map((t, idx) => {
            const isActive = idx === currentTopicIndex;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTopic(idx)}
                className={`w-full text-left px-3 py-2.5 rounded text-xs font-mono transition-all border ${
                  isActive
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]/60 text-[#00E5FF] font-semibold shadow-[0_0_8px_rgba(0,229,255,0.1)]'
                    : 'bg-[#0A0E17] border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">#{idx + 1}</span>
                  <span className="leading-snug">{t.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lesson Reading Area */}
        <div className="lg:col-span-3 bg-[#111927] border border-[#1E293B] rounded-lg p-6 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono tracking-widest text-[#00FF66] uppercase">
              {currentModule.title}
            </span>
            <h2 className="text-xl font-bold font-mono text-white mt-1">
              {topic.title}
            </h2>
          </div>

          {/* Main Text Content */}
          <div className="text-sm font-mono text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap">
            {topic.content}
          </div>

          {/* Code Snippet Box (if available) */}
          {topic.codeSnippet && (
            <div className="rounded-lg border border-[#00FF66]/30 bg-[#05080E] overflow-hidden">
              <div className="bg-[#0A0E17] px-4 py-2 border-b border-[#00FF66]/20 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-[#00FF66]">
                  <Code className="w-3.5 h-3.5" />
                  <span className="font-bold uppercase tracking-wider">{topic.codeSnippet.language} KODI</span>
                </div>
                <button
                  onClick={() => handleCopyCode(topic.codeSnippet!.code)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-[#00FF66]"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-[#00FF66]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "Nusxalandi!" : "Nusxa Olish"}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-[#00FF66] overflow-x-auto selection:bg-[#00FF66]/30">
                <code>{topic.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Key Takeaways */}
          {topic.keyPoints && (
            <div className="p-4 rounded-lg bg-[#0A0E17] border border-[#00E5FF]/20 space-y-2">
              <h4 className="text-xs font-bold font-mono text-[#00E5FF] uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Asosiy Xulosalar & Xavfsizlik Qoidalari:
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-slate-300 list-disc list-inside">
                {topic.keyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Navigation for Topics */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              disabled={currentTopicIndex === 0}
              onClick={() => handleSelectTopic(currentTopicIndex - 1)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono border transition-all ${
                currentTopicIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                  : 'border-slate-700 text-slate-300 hover:border-[#00E5FF] hover:text-[#00E5FF] cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Oldingi Mavzu
            </button>

            {currentTopicIndex < currentModule.topics.length - 1 ? (
              <button
                onClick={() => handleSelectTopic(currentTopicIndex + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 font-bold cursor-pointer"
              >
                Keyingi Mavzu
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onStartQuiz(currentModule.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0A0E17] font-bold shadow-[0_0_12px_rgba(0,255,102,0.3)] cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Modul Testini Boshlash
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
