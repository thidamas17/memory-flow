import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
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

  // Mnemonic image
  const [mnemonicEnabled, setMnemonicEnabled] = useState(true);
  const [mnemonicImage, setMnemonicImage] = useState('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80');
  const [mnemonicCaption, setMnemonicCaption] = useState('ต้นกล้าแตกหน่อผ่านคอนกรีต สะท้อนความไม่ยอมแพ้');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

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
        if (result.mnemonicImage) {
          setMnemonicImage(result.mnemonicImage);
          setMnemonicCaption(result.mnemonicCaption);
        }
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
        enabled: mnemonicEnabled,
        imageUrl: mnemonicImage,
        caption: mnemonicCaption,
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
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {saveSuccessNotice && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto bg-[#1A146B] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs animate-in slide-in-from-top duration-300">
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
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-[#E8E1DB]">
        <button className="flex items-center space-x-1.5 text-xs font-semibold text-[#1E1B17] hover:text-[#312E81] transition-colors cursor-pointer">
          <span>{sourceLang}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#777682]" />
        </button>

        <button
          onClick={() => {
            const temp = sourceLang;
            setSourceLang(targetLang);
            setTargetLang(temp);
          }}
          className="p-1.5 rounded-full hover:bg-[#F4EDE6] text-[#777682] active:scale-95 transition-all cursor-pointer"
          title="สลับภาษา"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <button className="flex items-center space-x-1.5 text-xs font-semibold text-[#1E1B17] hover:text-[#312E81] transition-colors cursor-pointer">
          <span>{targetLang}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#777682]" />
        </button>
      </div>

      {/* Search & Word Input Card */}
      <div className="bg-white p-4 rounded-3xl shadow-xs border border-[#E8E1DB] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1E1B17]">
            <span className="text-base">🔍</span>
            <span>คำศัพท์ที่ต้องการเพิ่ม</span>
          </div>
          <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#E2DFFF] text-[#1A146B] text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-[#5654A8]" />
            <span>Live Auto-Fetch</span>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative flex items-center bg-[#F8F6F4] rounded-2xl border border-[#E8E1DB] focus-within:border-[#312E81] focus-within:ring-2 focus-within:ring-[#312E81]/15 transition-all px-3.5 py-2">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="พิมพ์คำศัพท์ภาษาอังกฤษ..."
            className="w-full bg-transparent text-lg font-bold text-[#1A146B] placeholder-[#777682]/60 focus:outline-none pr-16"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="p-1 rounded-full text-[#777682] hover:text-[#1E1B17] hover:bg-[#E8E1DB] transition-all cursor-pointer"
                title="ล้างข้อความ"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handlePronounce}
              className="p-2 rounded-xl bg-[#E2DFFF] text-[#1A146B] hover:bg-[#C3C0FF] active:scale-95 transition-all cursor-pointer"
              title="ฟังเสียงออกเสียง"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto Fetch Status Note */}
        <div className="flex items-center space-x-2 text-[11px] text-[#904D00]">
          <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0 animate-pulse"></span>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-[#D97706] tracking-wider uppercase text-[10px]">
              {isFetching ? 'กำลังค้นหา...' : '⚡ RKLES'}
            </span>
            <span>
              {isFetching
                ? 'กำลังดึงข้อมูลจากพจนานุกรม...'
                : 'ดึงข้อมูลจาก Dictionary API อัตโนมัติ สมบูรณ์แล้ว'}
            </span>
          </div>
        </div>
      </div>

      {/* Word Details Card */}
      <div className="bg-white p-4.5 rounded-3xl shadow-xs border border-[#E8E1DB] space-y-4">
        {/* Title, Audio, CEFR */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-extrabold text-[#1A146B] tracking-tight font-display">
                {word || query}
              </h2>
              <button
                onClick={handlePronounce}
                className="p-1.5 rounded-full bg-[#E2DFFF]/70 hover:bg-[#E2DFFF] text-[#1A146B] transition-transform active:scale-90 cursor-pointer"
                title="ฟังการออกเสียง"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-[#777682] mt-0.5 font-medium">{phonetic}</div>
          </div>

          {/* CEFR Level */}
          <div className="text-right">
            <span className="text-[10px] text-[#777682] block leading-none mb-1">CEFR Level</span>
            <span className="inline-block px-2.5 py-0.5 rounded-lg border border-[#312E81] text-[#312E81] text-xs font-bold bg-[#E2DFFF]/20">
              {cefr}
            </span>
          </div>
        </div>

        {/* Part of Speech Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1E1B17] block">
            ชนิดของคำ (Part of Speech)
          </label>
          <div className="flex flex-wrap gap-1.5">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1A146B] text-white shadow-xs'
                      : 'bg-[#F4EDE6] text-[#474651] hover:bg-[#E8E1DB]'
                  }`}
                >
                  {active && <span className="mr-1">✓</span>}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meaning / Translation (Editable) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1E1B17]">ความหมาย / คำแปล (แก้ไขได้)</label>
            <button
              onClick={() => setIsEditingMeaning(!isEditingMeaning)}
              className="text-[11px] text-[#777682] hover:text-[#312E81] underline cursor-pointer"
            >
              {isEditingMeaning ? 'บันทึก' : 'แตะเพื่อแก้ไข'}
            </button>
          </div>

          <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-[#E8E1DB] focus-within:border-[#312E81] transition-all">
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
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1E1B17]">
            ประโยคตัวอย่าง (Example Context)
          </label>
          <div className="p-3.5 bg-[#FAF2EB] rounded-2xl border border-[#E8E1DB]/70 space-y-1.5">
            <div className="flex items-start space-x-2">
              <span className="text-[#312E81] font-serif text-lg leading-none font-bold">“</span>
              <p className="text-xs font-medium text-[#1E1B17] leading-relaxed">{exampleEn}</p>
            </div>
            <p className="text-[11px] italic text-[#474651] pl-4 leading-relaxed">
              "{exampleTh}"
            </p>
          </div>
        </div>
      </div>

      {/* Visual Mnemonic Card */}
      <div className="bg-white p-4.5 rounded-3xl shadow-xs border border-[#E8E1DB] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1E1B17]">
            <ImageIcon className="w-4 h-4 text-[#904D00]" />
            <span>รูปภาพช่วยจำ (Visual Mnemonic)</span>
          </div>
          {/* Toggle Switch */}
          <button
            onClick={() => setMnemonicEnabled(!mnemonicEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              mnemonicEnabled ? 'bg-[#1A146B]' : 'bg-[#E8E1DB]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                mnemonicEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {mnemonicEnabled && (
          <div className="pt-1 space-y-3">
            <div className="flex items-center space-x-3 bg-[#FAF2EB] p-3 rounded-2xl border border-[#E8E1DB]/60">
              {/* Image Preview with Remove */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white shadow-xs">
                <img
                  src={mnemonicImage}
                  alt="Visual Mnemonic"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() =>
                    setMnemonicImage(
                      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80'
                    )
                  }
                  className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black transition-colors cursor-pointer"
                  title="เปลี่ยนรูปภาพ"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Caption & Buttons */}
              <div className="flex-1 space-y-2">
                <p className="text-[11px] text-[#474651] leading-snug line-clamp-2">
                  ภาพความหมาย: "{mnemonicCaption}"
                </p>

                <div className="flex items-center space-x-1.5">
                  <label className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white border border-[#E8E1DB] text-[11px] font-semibold text-[#1E1B17] hover:bg-[#F4EDE6] cursor-pointer shadow-xs active:scale-95 transition-all">
                    <Upload className="w-3 h-3 text-[#777682]" />
                    <span>อัปโหลดรูป</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setMnemonicImage(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  <button
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white border border-[#E8E1DB] text-[11px] font-semibold text-[#1E1B17] hover:bg-[#F4EDE6] cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <LinkIcon className="w-3 h-3 text-[#777682]" />
                    <span>ใส่ URL ภาพ</span>
                  </button>
                </div>
              </div>
            </div>

            {showUrlInput && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="วางลิงก์รูปภาพ เช่น https://..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#FAF2EB] text-xs rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81]"
                />
                <button
                  onClick={() => {
                    if (customImageUrl.trim()) {
                      setMnemonicImage(customImageUrl.trim());
                      setShowUrlInput(false);
                      setCustomImageUrl('');
                    }
                  }}
                  className="px-3 py-1.5 bg-[#1A146B] text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-[#312E81]"
                >
                  ใช้รูปนี้
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Database Verification Banner: Check if new or repeated */}
      {isDuplicate ? (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF1D6] border border-[#FE932C]/40 text-[#904D00]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FE932C]/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#663500]">
                ตรวจพบคำนี้ในคลังแล้ว! (บันทึกซ้ำครั้งที่ {existingWord.repeatCount + 1})
              </div>
              <div className="text-[11px] text-[#904D00]/90">
                ระบบจะอัปเดต repeat_count และปรับขึ้นคิวทบทวนทันที
              </div>
            </div>
          </div>
          <RefreshCw className="w-4 h-4 text-[#D97706] shrink-0 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#E6F9EE] border border-[#059669]/30 text-[#00432D]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#059669]/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#002B1B]">ตรวจสอบฐานข้อมูลแล้ว</div>
              <div className="text-[11px] text-[#00432D]">คำศัพท์ใหม่! ยังไม่มีในคลังคำศัพท์ของคุณ</div>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
        </div>
      )}

      {/* Bottom Save Action Button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 px-4 rounded-2xl bg-[#1A146B] hover:bg-[#312E81] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md shadow-[#1A146B]/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        <BookmarkPlus className="w-4 h-4 stroke-[2.5]" />
        <span>บันทึกเข้าคลังคำศัพท์ (+ Add to Vault)</span>
      </button>
    </div>
  );
};
