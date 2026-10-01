import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  FolderArchive, 
  Sparkles,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { PYTHON_FILES, PythonFileItem } from '../data/pythonSources';

interface PythonSourceViewProps {
  logAction: (level: any, msg: string) => void;
}

export const PythonSourceView: React.FC<PythonSourceViewProps> = ({ logAction }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const currentFile: PythonFileItem = PYTHON_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    logAction('SYSTEM', `${currentFile.filename} fayl kodi nusxalandi.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      PYTHON_FILES.forEach((f) => {
        zip.file(f.filename, f.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'KiberAkademiya_PyQt6_Desktop.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logAction('SYSTEM', 'Barcha Python fayllar ZIP arxivida muvaffaqiyatli yuklab olindi!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logAction('SYSTEM', `${currentFile.filename} yuklab olindi.`);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Info */}
      <div className="bg-[#111927] border border-[#00E5FF]/30 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4 box-glow-cyan">
        <div>
          <div className="flex items-center gap-2 text-[#00FF66] text-xs font-bold uppercase tracking-wider mb-1">
            <Laptop className="w-4 h-4" />
            <span>Mustaqil Windows (.EXE) Desktop Dasturi Manba Kodlari</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white">
            Python PyQt6 + SQLite3 Loyiha Fayllari
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Quyida Windows uchun PyInstaller orqali bitta mustaqil <code>.exe</code> qilib yig'ishga 100% tayyor bo'lgan 
            PyQt6 desktop dasturi kodlari jamlangan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2.5 rounded bg-[#00FF66] hover:bg-[#00FF66]/90 text-[#0A0E17] font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.4)] transition-all cursor-pointer"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{isZipping ? "ZIP Yaratilmoqda..." : "Barchasini ZIP Yuklab Olish"}</span>
          </button>

          <button
            onClick={handleDownloadSingleFile}
            className="px-3 py-2 rounded bg-[#0A0E17] border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Faylni Yuklab Olish</span>
          </button>
        </div>
      </div>

      {/* Windows .exe Creation Instructions Card */}
      <div className="bg-[#05080E] border border-[#FF0055]/40 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#FF0055] uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Windows .exe Yaratish Bo'yicha Qisqa Yo'riqnoma:
          </h3>
          <span className="text-[10px] text-slate-400">PyInstaller 6.x</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#0A0E17] p-3 rounded border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[11px]">1. Kutubxonalarni o'rnatish:</div>
            <code className="text-[#00FF66] block bg-black/40 p-1.5 rounded">
              pip install -r requirements.txt
            </code>
          </div>
          <div className="bg-[#0A0E17] p-3 rounded border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[11px]">2. Bitta .exe faylga yig'ish (Standalone):</div>
            <code className="text-[#00E5FF] block bg-black/40 p-1.5 rounded">
              pyinstaller --onefile --windowed --name="KiberAkademiya_Uz" main.py
            </code>
          </div>
        </div>
      </div>

      {/* Files Navigator & Code Viewer */}
      <div className="bg-[#111927] border border-slate-800 rounded-lg overflow-hidden">
        {/* File Tabs */}
        <div className="bg-[#0A0E17] border-b border-slate-800 px-3 flex flex-wrap gap-1 pt-2">
          {PYTHON_FILES.map((f, idx) => {
            const isSelected = idx === selectedFileIndex;
            return (
              <button
                key={f.filename}
                onClick={() => setSelectedFileIndex(idx)}
                className={`px-3 py-2 rounded-t text-xs font-mono transition-all border-t border-x cursor-pointer ${
                  isSelected
                    ? 'bg-[#111927] border-[#00E5FF]/40 text-[#00E5FF] font-bold border-b-transparent'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {f.filename}
              </button>
            );
          })}
        </div>

        {/* File details bar */}
        <div className="bg-[#0D131F] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#00FF66]" />
            <span className="font-bold text-white">{currentFile.filename}</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">— {currentFile.description}</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0A0E17] border border-slate-700 hover:border-[#00FF66] text-slate-300 hover:text-white text-xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Nusxalandi!" : "Kodni Nusxalash"}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-[#05080E] overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="text-xs text-[#00FF66] leading-relaxed select-text font-mono">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
