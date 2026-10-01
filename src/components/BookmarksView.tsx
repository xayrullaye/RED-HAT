import React from 'react';
import { Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { BookmarkItem } from '../types';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  onDeleteBookmark: (id: string) => void;
  onGoToTopic: (moduleId: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onDeleteBookmark,
  onGoToTopic,
}) => {
  return (
    <div className="space-y-4 font-mono">
      <div className="bg-[#111927] border border-[#00E5FF]/20 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#00E5FF]" />
            Saqlangan Xatcho'plar (Bookmarks)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Keyinroq takrorlash va chuqurroq o'rganish uchun belgilangan mavzular.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-[#0A0E17] border border-slate-700 text-[#00FF66]">
          Jami: {bookmarks.length} ta
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-[#111927] border border-slate-800 rounded-lg p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">Hozircha xatcho'plar mavjud emas</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Darslarni o'qiyotganingizda yuqori o'ng burchakdagi "Xatcho'pga Saqlash" tugmasini bossangiz, 
            mavzular shu ro'yxatda paydo bo'ladi.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-[#111927] border border-slate-800 hover:border-[#00E5FF]/50 p-4 rounded-lg flex items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-bold">
                    {b.moduleId}-Modul
                  </span>
                  <span className="text-[10px] text-slate-500">{b.createdAt}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{b.topicTitle}</h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onGoToTopic(b.moduleId)}
                  className="px-3 py-1.5 rounded bg-[#0A0E17] hover:bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Darsni O'qish</span>
                </button>
                <button
                  onClick={() => onDeleteBookmark(b.id)}
                  title="O'chirish"
                  className="p-1.5 rounded bg-[#0A0E17] hover:bg-[#FF0055]/20 border border-slate-700 hover:border-[#FF0055] text-slate-400 hover:text-[#FF0055] transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
