import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  AlertCircle,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { MODULES, QuizQuestion } from '../data/lessons';
import { ModuleProgress } from '../types';

interface QuizViewProps {
  currentModuleId: number;
  onSelectModule: (id: number) => void;
  progress: Record<number, ModuleProgress>;
  onQuizComplete: (moduleId: number, scorePercent: number, passed: boolean) => void;
  onGoToLessons: (moduleId: number) => void;
  logAction: (level: any, msg: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  currentModuleId,
  onSelectModule,
  progress,
  onQuizComplete,
  onGoToLessons,
  logAction,
}) => {
  const currentModule = MODULES.find((m) => m.id === currentModuleId) || MODULES[0];
  const questions: QuizQuestion[] = currentModule.quiz;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const currentQ = questions[currentQIndex];
  const totalQuestions = questions.length;

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.answer;
    
    setUserAnswers((prev) => ({
      ...prev,
      [currentQIndex]: {
        selected: selectedOption,
        isCorrect,
      },
    }));
    setIsAnswerSubmitted(true);
    logAction(
      isCorrect ? 'SECURITY' : 'DANGER',
      `Savol ${currentQIndex + 1}: ${isCorrect ? "To'g'ri javob berildi" : "Noto'g'ri javob berildi"}`
    );
  };

  const handleNextQuestion = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate score
      const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);
      const passed = scorePercent >= 80;

      setIsQuizFinished(true);
      onQuizComplete(currentModule.id, scorePercent, passed);

      if (passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00FF66', '#00E5FF', '#FFFFFF']
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsQuizFinished(false);
    logAction('SYSTEM', `${currentModule.id}-Modul testi qayta boshlandi.`);
  };

  // If Quiz is finished, show Summary Screen
  if (isQuizFinished) {
    const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercent >= 80;

    return (
      <div className="max-w-2xl mx-auto bg-[#111927] border border-[#00E5FF]/30 rounded-lg p-6 md:p-8 space-y-6 box-glow-cyan font-mono text-center">
        <div className="inline-flex p-4 rounded-full bg-[#0A0E17] border border-[#00FF66]/40 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
          {passed ? (
            <Award className="w-12 h-12 text-[#00FF66]" />
          ) : (
            <AlertCircle className="w-12 h-12 text-[#FF0055]" />
          )}
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-widest">
            {currentModule.title} // IMTIHON NATIJASI
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {passed ? "MUVAFFAQIYATLI YAKUNLANDI! 🎉" : "SINOLDAN O'TOLMADINGIZ ⚠️"}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-[#0A0E17] p-4 rounded-lg border border-slate-800 text-left">
          <div>
            <div className="text-[10px] text-slate-500">Jami Savollar:</div>
            <div className="text-lg font-bold text-white">{totalQuestions} ta</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">To'g'ri Javoblar:</div>
            <div className="text-lg font-bold text-[#00FF66]">{correctCount} ta</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Umumiy Natija:</div>
            <div className={`text-lg font-bold ${passed ? 'text-[#00FF66]' : 'text-[#FF0055]'}`}>
              {scorePercent}%
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {passed ? (
            <span>
              Tabriklaymiz! Siz 80% dan yuqori natija ko'rsatdingiz. 
              {currentModule.id < 6 ? " Keyingi modul muvaffaqiyatli ochildi!" : " Barcha modullar muvaffaqiyatli topshirildi!"}
            </span>
          ) : (
            <span>
              Keyingi modulni ochish uchun kamida <strong className="text-[#FF0055]">80% to'g'ri javob</strong> talab qilinadi.
              Darslikni qayta ko'zdan kechirib, testni qayta topshirishingizni tavsiya qilamiz.
            </span>
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestartQuiz}
            className="px-4 py-2 bg-[#0A0E17] hover:bg-[#1E293B] border border-slate-700 text-slate-200 text-xs rounded font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Qayta Topshirish
          </button>

          <button
            onClick={() => onGoToLessons(currentModule.id)}
            className="px-4 py-2 bg-[#0A0E17] hover:bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF] text-xs rounded font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Darslikka Qaytish
          </button>

          {passed && currentModule.id < 6 && (
            <button
              onClick={() => {
                onSelectModule(currentModule.id + 1);
                handleRestartQuiz();
              }}
              className="px-4 py-2 bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0A0E17] text-xs rounded font-bold flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,102,0.4)] transition-all cursor-pointer"
            >
              Keyingi Modulga O'tish ({currentModule.id + 1})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Select Bar */}
      <div className="bg-[#111927] border border-[#00E5FF]/20 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00FF66]" />
          <span className="font-bold text-white">{currentModule.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Talab: <strong className="text-[#FF0055]">≥ 80%</strong>
          </span>
          <select
            value={currentModuleId}
            onChange={(e) => {
              onSelectModule(Number(e.target.value));
              handleRestartQuiz();
            }}
            className="bg-[#0A0E17] text-[#00E5FF] border border-slate-700 rounded px-2 py-1 text-xs"
          >
            {MODULES.map((m) => {
              const p = progress[m.id];
              const isUnlocked = p ? p.isUnlocked : m.id === 1;
              return (
                <option key={m.id} value={m.id} disabled={!isUnlocked}>
                  {m.id}-Modul {isUnlocked ? '' : '🔒'}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#111927] border border-[#1E293B] rounded-lg p-6 space-y-5 font-mono">
        {/* Progress header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Savol {currentQIndex + 1} / {totalQuestions}</span>
            <span className="text-[#00FF66]">
              {Math.round(((currentQIndex) / totalQuestions) * 100)}% yakunlandi
            </span>
          </div>
          <div className="w-full bg-[#0A0E17] h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-[#00E5FF] to-[#00FF66] h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <div className="border-l-2 border-[#00E5FF] pl-3 py-1">
          <h3 className="text-base font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQ.answer;

            let optionStyle = "border-slate-800 bg-[#0A0E17] text-slate-300 hover:border-slate-700";

            if (isAnswerSubmitted) {
              if (isCorrectAnswer) {
                optionStyle = "border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66] font-bold";
              } else if (isSelected && !isCorrectAnswer) {
                optionStyle = "border-[#FF0055] bg-[#FF0055]/10 text-[#FF0055]";
              } else {
                optionStyle = "border-slate-900 bg-[#0A0E17]/40 text-slate-600";
              }
            } else if (isSelected) {
              optionStyle = "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] font-semibold";
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-3.5 rounded-md border text-xs transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  isSelected ? 'border-current bg-current/20' : 'border-slate-700'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation Alert (Visible after submission) */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-md border text-xs space-y-1.5 ${
            selectedOption === currentQ.answer
              ? 'border-[#00FF66]/40 bg-[#00FF66]/10 text-[#00FF66]'
              : 'border-[#FF0055]/40 bg-[#FF0055]/10 text-[#FF0055]'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              {selectedOption === currentQ.answer ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TO'G'RI JAVOB!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>NOTO'G'RI JAVOB!</span>
                </>
              )}
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>💡 Tushuntirish:</strong> {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          {!isAnswerSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className={`px-5 py-2.5 rounded text-xs font-bold transition-all ${
                selectedOption !== null
                  ? 'bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0A0E17] shadow-[0_0_10px_rgba(0,229,255,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              Javobni Tekshirish
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded text-xs font-bold bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0A0E17] flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,102,0.4)] cursor-pointer"
            >
              <span>{currentQIndex < totalQuestions - 1 ? "Keyingi Savol" : "Natijalarni Ko'rish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
