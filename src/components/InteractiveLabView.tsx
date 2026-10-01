import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Layers, 
  Network, 
  Database, 
  Hash, 
  Terminal, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  RotateCcw,
  Check,
  AlertTriangle
} from 'lucide-react';

interface InteractiveLabViewProps {
  logAction: (level: any, msg: string) => void;
}

export const InteractiveLabView: React.FC<InteractiveLabViewProps> = ({ logAction }) => {
  const [activeTab, setActiveTab] = useState<'xor' | 'memory' | 'packet' | 'sqli' | 'hash'>('xor');

  // 1. Bitwise XOR Lab State
  const [xorText, setXorText] = useState('CyberUzbekistan');
  const [xorKey, setXorKey] = useState('SECURITY');
  const [xorResult, setXorResult] = useState<{ cipherText: string; hex: string; steps: string[] }>({
    cipherText: '',
    hex: '',
    steps: [],
  });

  const runXor = () => {
    if (!xorText || !xorKey) return;
    const cipherChars: string[] = [];
    const steps: string[] = [];

    for (let i = 0; i < xorText.length; i++) {
      const charCode = xorText.charCodeAt(i);
      const keyCode = xorKey.charCodeAt(i % xorKey.length);
      const xored = charCode ^ keyCode;
      cipherChars.push(String.fromCharCode(xored));

      const binChar = charCode.toString(2).padStart(8, '0');
      const binKey = keyCode.toString(2).padStart(8, '0');
      const binXor = xored.toString(2).padStart(8, '0');

      if (i < 8) {
        steps.push(`[${xorText[i]}] ${binChar}  XOR  [${xorKey[i % xorKey.length]}] ${binKey}  =  ${binXor} (Hex: 0x${xored.toString(16).padStart(2, '0').toUpperCase()})`);
      }
    }

    const cipher = cipherChars.join('');
    const hex = Array.from(cipher).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');

    setXorResult({ cipherText: cipher, hex, steps });
    logAction('LAB', `Bitwise XOR hisoblandi (${xorText.length} bayt)`);
  };

  useEffect(() => {
    runXor();
  }, [xorText, xorKey]);

  // 2. SHA-256 Hash Lab State
  const [hashInput, setHashInput] = useState('KiberXavfsizlik 2026');
  const [hashOutput, setHashOutput] = useState('');

  useEffect(() => {
    const calcHash = async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashOutput(hashHex);
    };
    calcHash();
  }, [hashInput]);

  // 3. Memory Stack/Heap Lab State
  const [stackFrames, setStackFrames] = useState([
    { name: 'main()', address: '0x7FFFFFFF', vars: ['int argc = 1', 'char** argv'] },
    { name: 'login_check()', address: '0x7FFFFFF0', vars: ['char password[16]', 'int is_admin = 0'] },
  ]);
  const [heapBlocks, setHeapBlocks] = useState([
    { id: 1, size: '1024 Bytes', address: '0x005A1020', freed: false, leak: false },
    { id: 2, size: '512 Bytes', address: '0x005A1440', freed: true, leak: false },
  ]);

  const addStackFrame = () => {
    const newFrame = {
      name: `process_data_${stackFrames.length + 1}()`,
      address: `0x7FFFFF${(15 - stackFrames.length).toString(16)}0`,
      vars: ['int token_id', 'buffer_ptr -> Heap'],
    };
    setStackFrames([newFrame, ...stackFrames]);
    logAction('LAB', `Stack ga yangi ramka (frame) qo'shildi: ${newFrame.name}`);
  };

  const popStackFrame = () => {
    if (stackFrames.length > 1) {
      setStackFrames(stackFrames.slice(1));
      logAction('LAB', "Stack dan funksiya qaytdi (POP return address).");
    }
  };

  const allocateHeap = () => {
    const newBlock = {
      id: heapBlocks.length + 1,
      size: '2048 Bytes',
      address: `0x005A${(1020 + heapBlocks.length * 500).toString(16)}`,
      freed: false,
      leak: false,
    };
    setHeapBlocks([...heapBlocks, newBlock]);
    logAction('LAB', `Heap dan malloc(2048) ajratildi: ${newBlock.address}`);
  };

  const freeLastHeap = () => {
    if (heapBlocks.length > 0) {
      const updated = [...heapBlocks];
      const last = updated[updated.length - 1];
      last.freed = true;
      setHeapBlocks(updated);
      logAction('LAB', `free(${last.address}) bajarildi.`);
    }
  };

  const triggerMemoryLeak = () => {
    const leaked = heapBlocks.map(b => b.freed ? b : { ...b, leak: true });
    setHeapBlocks(leaked);
    logAction('DANGER', 'XOTIRA SIZIB CHIQISHI: Xotira manzili yo\'qotildi va free() qilinmadi!');
  };

  // 4. SQL Injection Sandbox
  const [sqliInput, setSqliInput] = useState("' OR '1'='1' --");
  const [isPreparedMode, setIsPreparedMode] = useState(false);

  const rawQuery = `SELECT * FROM users WHERE username = '${sqliInput}' AND password = '***'`;
  const isVulnerableExploited = !isPreparedMode && (sqliInput.includes("' OR '1'='1") || sqliInput.includes("' or '1'='1") || sqliInput.includes("'--"));

  return (
    <div className="space-y-4 font-mono">
      {/* Tab Navigation */}
      <div className="bg-[#111927] border border-[#00E5FF]/20 rounded-lg p-2 flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveTab('xor')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded font-bold transition-all cursor-pointer ${
            activeTab === 'xor'
              ? 'bg-[#00FF66] text-[#0A0E17] shadow-[0_0_10px_rgba(0,255,102,0.3)]'
              : 'bg-[#0A0E17] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          1. Bitwise XOR Shifr
        </button>

        <button
          onClick={() => setActiveTab('hash')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded font-bold transition-all cursor-pointer ${
            activeTab === 'hash'
              ? 'bg-[#00E5FF] text-[#0A0E17] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
              : 'bg-[#0A0E17] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          2. SHA-256 Xesh Kalkulyatori
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded font-bold transition-all cursor-pointer ${
            activeTab === 'memory'
              ? 'bg-[#00FF66] text-[#0A0E17] shadow-[0_0_10px_rgba(0,255,102,0.3)]'
              : 'bg-[#0A0E17] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          3. Stack & Heap Xotira
        </button>

        <button
          onClick={() => setActiveTab('sqli')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded font-bold transition-all cursor-pointer ${
            activeTab === 'sqli'
              ? 'bg-[#FF0055] text-white shadow-[0_0_10px_rgba(255,0,85,0.3)]'
              : 'bg-[#0A0E17] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          4. SQL Injection Sandbox
        </button>
      </div>

      {/* 1. BITWISE XOR TAB */}
      {activeTab === 'xor' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-[#00FF66] flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Bitwise XOR Shifrlovchi & Tiklovchi Simulyator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              XOR amali simmetrik: <code>(Matn ^ Kalit) = Shifr</code>, va yana <code>(Shifr ^ Kalit) = Asl Matn</code>!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Ochiq Matn (Plaintext):</label>
              <input
                type="text"
                value={xorText}
                onChange={(e) => setXorText(e.target.value)}
                className="w-full bg-[#0A0E17] border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#00FF66]"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">XOR Kaliti (Secret Key):</label>
              <input
                type="text"
                value={xorKey}
                onChange={(e) => setXorKey(e.target.value)}
                className="w-full bg-[#0A0E17] border border-slate-700 rounded px-3 py-2 text-xs text-[#00E5FF] outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3 pt-2">
            <div className="bg-[#0A0E17] p-3 rounded border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">Shifrlangan HEX baytlar:</div>
              <div className="text-xs text-[#00FF66] font-bold tracking-wider break-all">
                {xorResult.hex || '00'}
              </div>
            </div>

            <div className="bg-[#05080E] p-4 rounded border border-[#00FF66]/30 space-y-1.5">
              <div className="text-[10px] text-[#00E5FF] uppercase font-bold tracking-wider mb-2">
                Bit darajasidagi XOR amallari (Binary):
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                {xorResult.steps.map((st, i) => (
                  <div key={i} className="font-mono bg-[#0A0E17]/60 p-1.5 rounded border border-slate-900">
                    {st}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SHA-256 HASH TAB */}
      {activeTab === 'hash' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-[#00E5FF] flex items-center gap-2">
              <Hash className="w-4 h-4" />
              SHA-256 Kriptografik Xesh & Ko'chki Effekti (Avalanche Effect)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Matnda bitta harf yoki vergul o'zgartirib ko'ring — xesh butunlay o'zgaradi!
            </p>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Kiruvchi Matn:</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="w-full bg-[#0A0E17] border border-slate-700 rounded px-3 py-2.5 text-xs text-white outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="p-4 rounded-lg bg-[#05080E] border border-[#00E5FF]/40 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Hisoblangan SHA-256 Xesh (256 bit / 64 ta belgi):
            </div>
            <div className="text-sm font-bold text-[#00FF66] break-all tracking-wider selection:bg-[#00FF66]/30">
              {hashOutput}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="bg-[#0A0E17] p-3 rounded border border-slate-800">
              <strong className="text-[#00E5FF]">Bir Tomonlamalik:</strong> Xeshdan dastlabki parolni qaytarib bo'lmaydi.
            </div>
            <div className="bg-[#0A0E17] p-3 rounded border border-slate-800">
              <strong className="text-[#00FF66]">Kolliziyasizlik:</strong> Bir xil xesh hosil qiluvchi ikkita turli matn yo'q.
            </div>
          </div>
        </div>
      )}

      {/* 3. STACK & HEAP MEMORY TAB */}
      {activeTab === 'memory' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#00FF66] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Xotira Arxitekturasi: Stack va Heap Simulyatori
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                LIFO (Stack) tartibida ramkalar ajratilishi va dinamik xotira (Heap) sizib chiqishi.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addStackFrame}
                className="px-2.5 py-1.5 bg-[#00FF66]/20 border border-[#00FF66] text-[#00FF66] rounded text-xs hover:bg-[#00FF66] hover:text-[#0A0E17] transition-all cursor-pointer"
              >
                + Push Stack Frame
              </button>
              <button
                onClick={popStackFrame}
                className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs hover:text-white cursor-pointer"
              >
                - Pop Frame
              </button>
              <button
                onClick={allocateHeap}
                className="px-2.5 py-1.5 bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF] rounded text-xs hover:bg-[#00E5FF] hover:text-[#0A0E17] transition-all cursor-pointer"
              >
                + malloc() Heap
              </button>
              <button
                onClick={triggerMemoryLeak}
                className="px-2.5 py-1.5 bg-[#FF0055]/20 border border-[#FF0055] text-[#FF0055] rounded text-xs hover:bg-[#FF0055] hover:text-white transition-all cursor-pointer"
              >
                ⚠️ Memory Leak!
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stack Column */}
            <div className="bg-[#0A0E17] border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="text-xs font-bold text-[#00FF66] uppercase flex items-center justify-between">
                <span>STACK XOTIRASI (LIFO - Tezkor)</span>
                <span className="text-[10px] text-slate-500">ESP / EBP ko'rsatkichlari</span>
              </div>
              <div className="space-y-2">
                {stackFrames.map((f, i) => (
                  <div key={i} className="p-2.5 rounded bg-[#111927] border border-[#00FF66]/40 text-xs space-y-1">
                    <div className="flex justify-between text-[#00FF66] font-bold">
                      <span>{f.name}</span>
                      <span className="text-slate-500 text-[10px]">{f.address}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      O'zgaruvchilar: {f.vars.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heap Column */}
            <div className="bg-[#0A0E17] border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="text-xs font-bold text-[#00E5FF] uppercase flex items-center justify-between">
                <span>HEAP XOTIRASI (Dinamik - malloc/free)</span>
                <span className="text-[10px] text-slate-500">Global RAM maydoni</span>
              </div>
              <div className="space-y-2">
                {heapBlocks.map((b) => (
                  <div
                    key={b.id}
                    className={`p-2.5 rounded border text-xs space-y-1 ${
                      b.leak
                        ? 'bg-[#FF0055]/10 border-[#FF0055] text-[#FF0055]'
                        : b.freed
                        ? 'bg-slate-900/60 border-slate-800 text-slate-600 line-through'
                        : 'bg-[#111927] border-[#00E5FF]/40 text-[#00E5FF]'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>Blok #{b.id} ({b.size})</span>
                      <span className="text-[10px]">{b.address}</span>
                    </div>
                    <div className="text-[10px]">
                      {b.leak
                        ? 'XOTIRA SIZIB CHIQMOQDA (Memory Leak) - Free qilinmagan!'
                        : b.freed
                        ? 'Ozod qilindi (Freed)'
                        : 'Band (Allocated)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SQL INJECTION SANDBOX */}
      {activeTab === 'sqli' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FF0055] flex items-center gap-2">
                <Database className="w-4 h-4" />
                SQL Injection Sandbox & Prepared Statements Himoyasi
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Foydalanuvchi kiritgan matn to'g'ridan-to'g'ri so'rovga qo'shilsa (Concatenation) nima yuz berishini sinab ko'ring.
              </p>
            </div>

            <button
              onClick={() => setIsPreparedMode(!isPreparedMode)}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                isPreparedMode
                  ? 'bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66]'
                  : 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055]'
              }`}
            >
              {isPreparedMode ? "✅ Himoya Faol (Prepared Statements)" : "❌ Zaif Rejim (String Concatenation)"}
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Foydalanuvchi Login Maydoni (Kiritilayotgan qiymat):
            </label>
            <input
              type="text"
              value={sqliInput}
              onChange={(e) => setSqliInput(e.target.value)}
              className="w-full bg-[#0A0E17] border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#FF0055]"
            />
          </div>

          <div className="p-4 rounded-lg bg-[#05080E] border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              Server tomonida bajarilayotgan SQL so'rovi:
            </div>
            <code className="text-xs font-bold text-[#00E5FF] break-all block">
              {isPreparedMode ? (
                <span>SELECT * FROM users WHERE username = ? AND password = ? [PARAM: "{sqliInput}"]</span>
              ) : (
                <span>{rawQuery}</span>
              )}
            </code>
          </div>

          {/* Result Alert */}
          {isVulnerableExploited ? (
            <div className="p-4 rounded-lg bg-[#FF0055]/10 border border-[#FF0055] text-[#FF0055] text-xs space-y-1">
              <div className="font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                SQL INJECTION MUVAFFAQIYATLI AMALGA OSHDI!
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Shart <code>'1'='1'</code> har doim TRUE qiymat bergani uchun va <code>--</code> qolgan kodni izohga aylantirgani sababli, 
                tajovuzkor parolsiz tizimga <strong>Administrator</strong> sifatida kirib oldi!
              </p>
            </div>
          ) : isPreparedMode ? (
            <div className="p-4 rounded-lg bg-[#00FF66]/10 border border-[#00FF66] text-[#00FF66] text-xs space-y-1">
              <div className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                HIMOYA ISHLADI: Parametrlangan So'rov (Prepared Statement)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Ma'lumotlar bazasi kiritilgan qiymatni SQL kodi deb emas, balki shunchaki oddiy matn (literal string) deb qabul qildi. In'ektsiya muvaffaqiyatsiz bo'ldi!
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              Kiruvchi ma'lumot oddiy so'rov sifatida bajarildi. Zaiflikni sinash uchun yuqoridagi maydonga <code>' OR '1'='1' --</code> yozib ko'ring.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
