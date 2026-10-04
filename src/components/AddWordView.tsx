import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRightLeft,
  ChevronDown,
  BookmarkPlus,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { VocabWord, PartOfSpeech } from '../types/vocab';
import { fetchWordDefinition } from '../services/dictionary';
import { speakWord } from '../services/audio';

interface AddWordViewProps {
  vocabList: VocabWord[];
  onAddWord: (word: VocabWord, isDuplicate: boolean) => void;
  onNavigateToVault: () => void;
}

export const AddWordView: React.FC<AddWordViewProps> = ({
  vocabList,
  onAddWord,
  onNavigateToVault,
}) => {
  // Input query
  const [query, setQuery] = useState('resilient');
  const [sourceLang, setSourceLang] = useState('English (อังกฤษ)');
  const [targetLang, setTargetLang] = useState('ไทย (Thai)');

  // Word state fields
  const [word, setWord] = useState('resilient');
  const [phonetic, setPhonetic] = useState('/rɪˈzɪl.i.ənt/');
  const [cefr, setCefr] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('B2');
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>('adjective');
  const [meaning, setMeaning] = useState('ยืดหยุ่น, คืนสู่สภาพเดิมได้เร็ว, ฟื้นตัวเร็วเมื่อเจอปัญหา');
  const [isEditingMeaning, setIsEditingMeaning] = useState(false);
  const [exampleEn, setExampleEn] = useState('She is a resilient girl who bounces back quickly from challenges.');
  const [exampleTh, setExampleTh] = useState('เธอเป็นเด็กผู้หญิงที่มีความยืดหยุ่นทางใจและลุกขึ้นใหม่ได้อย่างรวดเร็ว');

  // Status & Fetching
  const [isFetching, setIsFetching] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Check if word exists in vault
  const existingWord = vocabList.find(
    (item) => item.word.trim().toLowerCase() === query.trim().toLowerCase()
  );
  const isDuplicate = !!existingWord;

  // Debounced auto-fetch
  const fetchTimeoutRef = useRef<any>(null);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) return;

    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    setIsFetching(true);
    setFetchSuccess(false);

    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await fetchWordDefinition(val);
        setWord(result.word);
        setPhonetic(result.phonetic);
        setPartOfSpeech(result.partOfSpeech);
        setMeaning(result.meaning);
        setExampleEn(result.exampleEn);
        setExampleTh(result.exampleTh);
        setCefr(result.cefr);
        setFetchSuccess(true);
      } catch {
        setFetchSuccess(false);
      } finally {
        setIsFetching(false);
      }
    }, 600);
  };

  const handlePronounce = () => {
    speakWord(word || query);
  };

  const handleSave = () => {
    if (!query.trim()) return;

    const newVocab: VocabWord = {
      id: existingWord ? existingWord.id : `vocab-${Date.now()}`,
      word: word || query,
      phonetic: phonetic,
      partOfSpeech: partOfSpeech,
      partOfSpeechTh:
        partOfSpeech === 'adjective'
          ? 'คุณศัพท์'
          : partOfSpeech === 'noun'
          ? 'นาม'
          : partOfSpeech === 'verb'
          ? 'กริยา'
          : 'กริยาวิเศษณ์',
      meaning: meaning,
      exampleEn: exampleEn,
      exampleTh: exampleTh,
      cefr: cefr,
      language: 'en-th',
      mnemonic: {
        enabled: false,
        imageUrl: '',
        caption: '',
      },
      repeatCount: existingWord ? existingWord.repeatCount + 1 : 1,
      mastered: false,
      accuracy: existingWord ? existingWord.accuracy : 50,
      priority: existingWord && existingWord.repeatCount >= 2 ? 'high' : 'medium',
      priorityLabel:
        existingWord && existingWord.repeatCount >= 2
          ? 'สูงมาก (ทบทวนทุกวัน)'
          : 'ปานกลาง (ทบทวนทุก 3 วัน)',
      lastSavedText: 'เมื่อสักครู่',
      historyDates: existingWord
        ? ['เมื่อสักครู่', ...existingWord.historyDates]
        : ['วันนี้'],
      nextReviewDays: 1,
      reviewCount: existingWord ? existingWord.reviewCount : 0,
      correctCount: existingWord ? existingWord.correctCount : 0,
    };

    onAddWord(newVocab, isDuplicate);

    if (isDuplicate) {
      setSaveSuccessNotice(
        `บันทึกซ้ำคำว่า "${newVocab.word}" ครั้งที่ ${newVocab.repeatCount}! ปรับขึ้นคิวทบทวนความสำคัญสูงเรียบร้อยแล้ว`
      );
    } else {
      setSaveSuccessNotice(`บันทึก "${newVocab.word}" เข้าสู่คลังคำศัพท์สำเร็จ!`);
    }

    setTimeout(() => {
      setSaveSuccessNotice(null);
    }, 3500);
  };

  return (
    <div className="pb-20 pt-1.5 px-3.5 max-w-md mx-auto space-y-3 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {saveSuccessNotice && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto bg-[#1A146B] text-white px-3.5 py-2.5 rounded-xl shadow-xl flex items-center justify-between text-xs animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button
            onClick={onNavigateToVault}
            className="underline font-bold text-amber-300 ml-2 shrink-0 cursor-pointer"
          >
            ดูคลัง
          </button>
        </div>
      )}

      {/* Language Selector Bar */}
      <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl shadow-xs border border-[#E8E1DB]">
        <button className="flex items-center space-x-1 text-xs font-semibold text-[#1E1B17] hover:text-[#312E81] transition-colors cursor-pointer">
          <span>{sourceLang}</span>
          <ChevronDown className="w-3 h-3 text-[#777682]" />
        </button>

        <button
          onClick={() => {
            const temp = sourceLang;
            setSourceLang(targetLang);
            setTargetLang(temp);
          }}
          className="p-1 rounded-full hover:bg-[#F4EDE6] text-[#777682] active:scale-95 transition-all cursor-pointer"
          title="สลับภาษา"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>

        <button className="flex items-center space-x-1 text-xs font-semibold text-[#1E1B17] hover:text-[#312E81] transition-colors cursor-pointer">
          <span>{targetLang}</span>
          <ChevronDown className="w-3 h-3 text-[#777682]" />
        </button>
      </div>

      {/* Search & Word Input Card */}
      <div className="bg-white p-3 rounded-2xl shadow-xs border border-[#E8E1DB] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1E1B17]">
            <span className="text-sm">🔍</span>
            <span>คำศัพท์ที่ต้องการเพิ่ม</span>
          </div>
          <div className="flex items-center space-x-1 px-2 py-0.2 rounded-full bg-[#E2DFFF] text-[#1A146B] text-[10px] font-semibold">
            <Sparkles className="w-2.5 h-2.5 text-[#5654A8]" />
            <span>Live Auto-Fetch</span>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative flex items-center bg-[#F8F6F4] rounded-xl border border-[#E8E1DB] focus-within:border-[#312E81] focus-within:ring-2 focus-within:ring-[#312E81]/15 transition-all px-3 py-1.5">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="พิมพ์คำศัพท์ภาษาอังกฤษ..."
            className="w-full bg-transparent text-base font-bold text-[#1A146B] placeholder-[#777682]/60 focus:outline-none pr-14"
          />

          <div className="absolute right-1.5 flex items-center space-x-1">
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="p-1 rounded-full text-[#777682] hover:text-[#1E1B17] hover:bg-[#E8E1DB] transition-all cursor-pointer"
                title="ล้างข้อความ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handlePronounce}
              className="p-1.5 rounded-lg bg-[#E2DFFF] text-[#1A146B] hover:bg-[#C3C0FF] active:scale-95 transition-all cursor-pointer"
              title="ฟังเสียงออกเสียง"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Auto Fetch Status Note */}
        <div className="flex items-center space-x-1.5 text-[10px] text-[#904D00]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 animate-pulse"></span>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-[#D97706] tracking-wider uppercase text-[9px]">
              {isFetching ? 'กำลังค้นหา...' : '⚡ RKLES'}
            </span>
            <span>
              {isFetching
                ? 'กำลังดึงข้อมูล...'
                : 'ดึงข้อมูลจาก Dictionary API อัตโนมัติ สมบูรณ์แล้ว'}
            </span>
          </div>
        </div>
      </div>

      {/* Word Details Card (Compact) */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#E8E1DB] space-y-3">
        {/* Title, Audio, CEFR */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-xl font-extrabold text-[#1A146B] tracking-tight font-display">
                {word || query}
              </h2>
              <button
                onClick={handlePronounce}
                className="p-1 rounded-full bg-[#E2DFFF]/70 hover:bg-[#E2DFFF] text-[#1A146B] transition-transform active:scale-90 cursor-pointer"
                title="ฟังการออกเสียง"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-[#777682] mt-0.5 font-medium">{phonetic}</div>
          </div>

          {/* CEFR Level */}
          <div className="text-right">
            <span className="text-[9px] text-[#777682] block leading-none mb-0.5">CEFR Level</span>
            <span className="inline-block px-2 py-0.2 rounded-md border border-[#312E81] text-[#312E81] text-[11px] font-bold bg-[#E2DFFF]/20">
              {cefr}
            </span>
          </div>
        </div>

        {/* Part of Speech Selection */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[#1E1B17] block">
            ชนิดของคำ (Part of Speech)
          </label>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'adjective', label: 'adjective (คุณศัพท์)' },
              { id: 'noun', label: 'noun (นาม)' },
              { id: 'verb', label: 'verb (กริยา)' },
              { id: 'adverb', label: 'adverb (กริยาวิเศษณ์)' },
            ].map((item) => {
              const active = partOfSpeech === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPartOfSpeech(item.id as PartOfSpeech)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1A146B] text-white shadow-xs'
                      : 'bg-[#F4EDE6] text-[#474651] hover:bg-[#E8E1DB]'
                  }`}
                >
                  {active && <span className="mr-0.5">✓</span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meaning / Translation (Editable) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[#1E1B17]">ความหมาย / คำแปล (แก้ไขได้)</label>
            <button
              onClick={() => setIsEditingMeaning(!isEditingMeaning)}
              className="text-[10px] text-[#777682] hover:text-[#312E81] underline cursor-pointer"
            >
              {isEditingMeaning ? 'บันทึก' : 'แตะเพื่อแก้ไข'}
            </button>
          </div>

          <div className="p-2.5 bg-[#FBFBFA] rounded-xl border border-[#E8E1DB] focus-within:border-[#312E81] transition-all">
            {isEditingMeaning ? (
              <textarea
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                rows={2}
                className="w-full bg-transparent text-xs text-[#1E1B17] leading-relaxed resize-none focus:outline-none"
              />
            ) : (
              <p
                onClick={() => setIsEditingMeaning(true)}
                className="text-xs text-[#1E1B17] leading-relaxed cursor-text"
              >
                {meaning}
              </p>
            )}
          </div>
        </div>

        {/* Example Context */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[#1E1B17]">
            ประโยคตัวอย่าง (Example Context)
          </label>
          <div className="p-2.5 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB]/70 space-y-1">
            <div className="flex items-start space-x-1.5">
              <span className="text-[#312E81] font-serif text-base leading-none font-bold">“</span>
              <p className="text-xs font-medium text-[#1E1B17] leading-snug">{exampleEn}</p>
            </div>
            <p className="text-[10px] italic text-[#474651] pl-3 leading-snug">
              "{exampleTh}"
            </p>
          </div>
        </div>
      </div>

      {/* Database Verification Banner: Check if new or repeated */}
      {isDuplicate ? (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF1D6] border border-[#FE932C]/40 text-[#904D00]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#FE932C]/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#663500]">
                ตรวจพบคำนี้ในคลังแล้ว! (บันทึกซ้ำครั้งที่ {existingWord.repeatCount + 1})
              </div>
              <div className="text-[10px] text-[#904D00]/90">
                ระบบจะอัปเดต repeat_count และปรับขึ้นคิวทบทวนทันที
              </div>
            </div>
          </div>
          <RefreshCw className="w-3.5 h-3.5 text-[#D97706] shrink-0 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E6F9EE] border border-[#059669]/30 text-[#00432D]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#059669]/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#002B1B]">ตรวจสอบฐานข้อมูลแล้ว</div>
              <div className="text-[10px] text-[#00432D]">คำศัพท์ใหม่! ยังไม่มีในคลังคำศัพท์ของคุณ</div>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
        </div>
      )}

      {/* Bottom Save Action Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 px-4 rounded-xl bg-[#1A146B] hover:bg-[#312E81] active:scale-[0.99] text-white font-bold text-xs tracking-wide shadow-md shadow-[#1A146B]/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
      >
        <BookmarkPlus className="w-4 h-4 stroke-[2.5]" />
        <span>บันทึกเข้าคลังคำศัพท์ (+ Add to Vault)</span>
      </button>
    </div>
  );
};
