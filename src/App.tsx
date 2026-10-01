/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHUD } from './components/TopHUD';
import { MiniTerminal } from './components/MiniTerminal';
import { DashboardView } from './components/DashboardView';
import { LessonReaderView } from './components/LessonReaderView';
import { QuizView } from './components/QuizView';
import { InteractiveLabView } from './components/InteractiveLabView';
import { BookmarksView } from './components/BookmarksView';
import { PythonSourceView } from './components/PythonSourceView';
import { ActivePage, UserProfile, ModuleProgress, BookmarkItem, TerminalLog } from './types';
import { MODULES } from './data/lessons';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [currentModuleId, setCurrentModuleId] = useState<number>(1);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(true);

  // 1. User Profile State (with persistence)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kiber_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      username: 'operator_01',
      fullname: 'Boshlang\'ich Kiber Kursant',
      xp: 120,
      rank: 'Kiber Kursant',
      badges: ['Tizimga Kirildi', 'CS Boshlang\'ich'],
    };
  });

  useEffect(() => {
    localStorage.setItem('kiber_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // 2. Module Progress State (with persistence)
  const [progress, setProgress] = useState<Record<number, ModuleProgress>>(() => {
    const saved = localStorage.getItem('kiber_module_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const initial: Record<number, ModuleProgress> = {};
    for (let i = 1; i <= 6; i++) {
      initial[i] = {
        isUnlocked: i === 1,
        isCompleted: false,
        bestScore: 0,
      };
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('kiber_module_progress', JSON.stringify(progress));
  }, [progress]);

  // 3. Bookmarks State (with persistence)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('kiber_bookmarks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: '1',
        moduleId: 1,
        topicTitle: '1.1. Kompyuter arxitekturasi: Protsessor (CPU) va Registrlar',
        createdAt: '2026-10-01 08:30',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('kiber_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 4. Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      level: 'SYSTEM',
      message: 'KiberAkademiya HUD tizimi ishga tushdi. Monospace uslubi va xavfsizlik protokollari faollashtirildi.',
      timestamp: '08:00:01',
    },
    {
      id: 'init-2',
      level: 'SECURITY',
      message: 'SQLite3 ma\'lumotlar bazasi tekshirildi: 6 ta modul, testlar va foydalanuvchi jadvallari tayyor.',
      timestamp: '08:00:03',
    },
    {
      id: 'init-3',
      level: 'INFO',
      message: 'Maslahat: Har bir modul yakunida kamida 80% to\'plang, shunda keyingi bosqich ochiladi.',
      timestamp: '08:00:05',
    },
  ]);

  const logAction = (level: TerminalLog['level'], message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 8);
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        level,
        message,
        timestamp: timeStr,
      },
    ]);
  };

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    logAction('EXEC', `> ${cmd}`);

    switch (cleanCmd) {
      case 'help':
      case 'yordam':
      case '?':
        logAction(
          'INFO',
          "Buyruqlar: 'help', 'status', 'modules', 'scan', 'stats', 'unlock_all', 'clear'"
        );
        break;
      case 'status':
        logAction(
          'SECURITY',
          `Foydalanuvchi: ${userProfile.fullname} | Unvon: ${userProfile.rank} | XP: ${userProfile.xp}`
        );
        break;
      case 'modules': {
        const summary = Object.entries(progress)
          .map(([mid, p]) => `M0${mid}: ${p.isUnlocked ? (p.isCompleted ? 'O\'tilgan' : 'Ochiq') : 'Qulflangan'}`)
          .join(' | ');
        logAction('INFO', `Modullar holati: ${summary}`);
        break;
      }
      case 'scan':
        logAction('SECURITY', 'Tarmoq skanerlash simulyatsiyasi boshlandi...');
        setTimeout(() => {
          logAction('SECURITY', '[OK] eth0 / lo0 portlari tekshirildi. Hech qanday shubhali oqim aniqlanmadi.');
        }, 600);
        break;
      case 'stats':
        logAction('INFO', `Jami XP: ${userProfile.xp} | Xatcho'plar: ${bookmarks.length} ta`);
        break;
      case 'unlock_all': {
        // Developer cheat / bypass to unlock all modules for easy review
        const unlocked: Record<number, ModuleProgress> = {};
        for (let i = 1; i <= 6; i++) {
          unlocked[i] = {
            isUnlocked: true,
            isCompleted: progress[i]?.isCompleted || false,
            bestScore: progress[i]?.bestScore || 0,
          };
        }
        setProgress(unlocked);
        logAction('SECURITY', 'DIQQAT: Barcha 6 ta modul ko\'rib chiqish uchun muvaffaqiyatli ochildi!');
        break;
      }
      case 'clear':
        setTerminalLogs([]);
        logAction('SYSTEM', 'Terminal tozalandi.');
        break;
      default:
        logAction('DANGER', `Noma'lum buyruq: '${cmd}'. 'help' buyrug'ini tering.`);
    }
  };

  // Add bookmark
  const handleBookmark = (moduleId: number, topicTitle: string) => {
    const existing = bookmarks.find((b) => b.topicTitle === topicTitle);
    if (!existing) {
      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
      const newBookmark: BookmarkItem = {
        id: `${Date.now()}`,
        moduleId,
        topicTitle,
        createdAt: dateStr,
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
      logAction('BOOKMARK', `Xatcho'p saqlandi: ${topicTitle}`);
    }
  };

  // Delete bookmark
  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    logAction('BOOKMARK', 'Xatcho\'p o\'chirildi.');
  };

  // Quiz completion logic
  const handleQuizComplete = (moduleId: number, scorePercent: number, passed: boolean) => {
    setProgress((prev) => {
      const current = prev[moduleId] || { isUnlocked: true, isCompleted: false, bestScore: 0 };
      const updatedBest = Math.max(current.bestScore, scorePercent);
      const isCompleted = updatedBest >= 80;

      const nextState = { ...prev };
      nextState[moduleId] = {
        ...current,
        bestScore: updatedBest,
        isCompleted,
      };

      // If passed (>=80%), unlock the next module!
      if (passed && moduleId < 6) {
        nextState[moduleId + 1] = {
          ...(nextState[moduleId + 1] || { isCompleted: false, bestScore: 0 }),
          isUnlocked: true,
        };
      }
      return nextState;
    });

    // Update XP and rank
    const xpGained = passed ? 120 : 30;
    setUserProfile((prev) => {
      const newXp = prev.xp + xpGained;
      let newRank = prev.rank;
      if (newXp >= 1500) newRank = 'Elita Kiber Himoyachi';
      else if (newXp >= 1000) newRank = 'Kiber Xavfsizlik Auditori';
      else if (newXp >= 600) newRank = 'Tarmoq & Kripto Tahlilchi';
      else if (newXp >= 300) newRank = 'Tizim Tahlilchisi';

      return {
        ...prev,
        xp: newXp,
        rank: newRank,
      };
    });

    logAction(
      passed ? 'SECURITY' : 'DANGER',
      `${moduleId}-Modul testi yakunlandi: ${scorePercent}% (${passed ? 'MUVAFFAQIYATLI - Keyingi modul ochildi' : 'Qayta urinib ko\'ring'}). +${xpGained} XP`
    );
  };

  return (
    <div className="flex h-screen bg-[#0A0E17] text-slate-100 font-mono overflow-hidden cyber-grid select-text">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        userProfile={userProfile}
        progress={progress}
      />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top HUD Status Bar */}
        <TopHUD
          userProfile={userProfile}
          progress={progress}
          toggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
          isTerminalOpen={isTerminalOpen}
        />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {activePage === 'dashboard' && (
              <DashboardView
                progress={progress}
                userProfile={userProfile}
                onOpenModule={(mid) => {
                  setCurrentModuleId(mid);
                  setActivePage('lessons');
                }}
                onStartQuiz={(mid) => {
                  setCurrentModuleId(mid);
                  setActivePage('quiz');
                }}
                onOpenPythonCode={() => setActivePage('python_code')}
                onOpenLab={() => setActivePage('lab')}
              />
            )}

            {activePage === 'lessons' && (
              <LessonReaderView
                currentModuleId={currentModuleId}
                onSelectModule={setCurrentModuleId}
                progress={progress}
                onBookmark={handleBookmark}
                onStartQuiz={(mid) => {
                  setCurrentModuleId(mid);
                  setActivePage('quiz');
                }}
                logAction={logAction}
              />
            )}

            {activePage === 'quiz' && (
              <QuizView
                currentModuleId={currentModuleId}
                onSelectModule={setCurrentModuleId}
                progress={progress}
                onQuizComplete={handleQuizComplete}
                onGoToLessons={(mid) => {
                  setCurrentModuleId(mid);
                  setActivePage('lessons');
                }}
                logAction={logAction}
              />
            )}

            {activePage === 'lab' && (
              <InteractiveLabView logAction={logAction} />
            )}

            {activePage === 'bookmarks' && (
              <BookmarksView
                bookmarks={bookmarks}
                onDeleteBookmark={handleDeleteBookmark}
                onGoToTopic={(mid) => {
                  setCurrentModuleId(mid);
                  setActivePage('lessons');
                }}
              />
            )}

            {activePage === 'python_code' && (
              <PythonSourceView logAction={logAction} />
            )}
          </div>
        </main>

        {/* Persistent Bottom Mini-Terminal HUD */}
        <MiniTerminal
          logs={terminalLogs}
          onCommand={handleCommand}
          onClear={() => setTerminalLogs([])}
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
        />
      </div>
    </div>
  );
}
