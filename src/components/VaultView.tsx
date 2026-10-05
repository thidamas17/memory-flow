import React, { useState } from 'react';
import {
  Search,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowUpDown,
  TrendingUp,
  X,
  History,
  Info,
} from 'lucide-react';
import { VocabWord } from '../types/vocab';
import { speakWord } from '../services/audio';

interface VaultViewProps {
  vocabList: VocabWord[];
  onStartReviewSession: (filterMode: 'all' | 'repeat') => void;
  onUpdateWord?: (word: VocabWord) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  vocabList,
  onStartReviewSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'repeat' | 'mastered' | 'review'>('all');
  const [sortByPriority, setSortByPriority] = useState(true);
  const [selectedWordForHistory, setSelectedWordForHistory] = useState<VocabWord | null>(null);

  // Compute stats
  const totalCount = 184; // Canonical stat shown in design
  const repeatCountItems = vocabList.filter((w) => w.repeatCount > 1);
  const repeatDisplayCount = repeatCountItems.length;

  // Filter words
  const filteredWords = vocabList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'repeat') {
      return item.repeatCount > 1;
    }
    if (activeFilter === 'mastered') {
      return item.mastered;
    }
    if (activeFilter === 'review') {
      return !item.mastered;
    }
    return true;
  });

  // Sort
  const sortedWords = [...filteredWords].sort((a, b) => {
    if (sortByPriority) {
      // Repeat count & priority first
      return b.repeatCount - a.repeatCount;
    }
    return a.word.localeCompare(b.word);
  });

  return (
    <div className="pb-32 pt-1.5 px-3.5 max-w-md mx-auto space-y-3 animate-in fade-in duration-300">
      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white rounded-xl border border-[#E8E1DB] shadow-xs px-3 py-2 focus-within:border-[#312E81] focus-within:ring-2 focus-within:ring-[#312E81]/10 transition-all">
        <Search className="w-3.5 h-3.5 text-[#777682] shrink-0 mr-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`ค้นหาคำศัพท์ในคลัง (${totalCount} คำ)...`}
          className="w-full bg-transparent text-xs text-[#1E1B17] placeholder-[#777682] focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-0.5 text-[#777682] hover:text-[#1E1B17] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#1A146B] text-white shadow-xs'
              : 'bg-[#F4EDE6] text-[#474651] hover:bg-[#E8E1DB]'
          }`}
        >
          ทั้งหมด {totalCount}
        </button>

        <button
          onClick={() => setActiveFilter('repeat')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'repeat'
              ? 'bg-[#FE932C] text-[#663500] ring-2 ring-[#FE932C]/40 shadow-xs'
              : 'bg-[#FFDCC3]/80 text-[#904D00] hover:bg-[#FFDCC3]'
          }`}
        >
          <span className="text-[11px]">🔁 ⚠️</span>
          <span>บันทึกซ้ำ</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#904D00] text-white text-[10px] ml-0.5 font-bold">
            {repeatDisplayCount}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('mastered')}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'mastered'
              ? 'bg-[#059669] text-white shadow-xs'
              : 'bg-[#E6F9EE] text-[#00432D] hover:bg-[#D1F2DF]'
          }`}
        >
          <span>จำได้แม่นยำ 128</span>
        </button>

        <button
          onClick={() => setActiveFilter('review')}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'review'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'bg-[#FFE4E8] text-[#9F1239] hover:bg-[#FECDD3]'
          }`}
        >
          <span>รอทบทวน 24</span>
        </button>
      </div>

      {/* Smart Duplicate Detection Highlight Card (Compact) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A146B] via-[#28227F] to-[#3B349E] text-white p-3.5 rounded-2xl shadow-sm space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <h3 className="font-bold text-xs tracking-tight flex items-center gap-1 font-display">
              <span>🔁 ตรวจจับคำศัพท์ซ้ำอัจฉริยะ</span>
            </h3>
          </div>
          <span className="px-1.5 py-0.2 bg-[#FEF08A] text-[#854D0E] font-black text-[9px] rounded tracking-wider">
            ACTIVE
          </span>
        </div>

        <p className="text-[11px] text-indigo-100 leading-snug">
          บันทึกศัพท์เดิมซ้ำ ระบบจะเพิ่ม <span className="font-bold text-amber-300">repeat_count</span> อัตโนมัติ โดยไม่สร้างการ์ดซ้ำซ้อน และปรับความสำคัญขึ้นคิวทบทวนทันที
        </p>

        <div className="flex items-center space-x-1 text-[10px] text-emerald-300 font-medium">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          <span>ประหยัดเวลา ไม่รกคลัง จำแม่นยำขึ้น 2.4 เท่า</span>
        </div>
      </div>

      {/* List Header & Sorting */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="text-xs font-bold text-[#1E1B17]">
          รายการคำศัพท์ล่าสุด <span className="font-normal text-[#777682] text-[11px]">(เรียงตามการบันทึกซ้ำ)</span>
        </div>
        <button
          onClick={() => setSortByPriority(!sortByPriority)}
          className="flex items-center space-x-1 text-xs font-semibold text-[#1A146B] hover:text-[#312E81] cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{sortByPriority ? 'ความสำคัญ' : 'A-Z'}</span>
        </button>
      </div>

      {/* Word Cards List (Compact) */}
      <div className="space-y-2">
        {sortedWords.map((item) => {
          const isHighRepeat = item.repeatCount >= 3;
          return (
            <div
              key={item.id}
              className="bg-white p-3 rounded-2xl shadow-xs border border-[#E8E1DB] space-y-2 transition-all hover:border-[#C8C5D3]"
            >
              {/* Top Row: Repeat or Mastered Badge + Timestamp */}
              <div className="flex items-center justify-between text-xs">
                {item.mastered ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#E6F9EE] text-[#00432D] font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                    <span>✓ จำได้แม่นยำ (Mastered)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#FFDCC3] text-[#904D00] font-bold text-[10px]">
                    <AlertTriangle className="w-3 h-3 text-[#D97706]" />
                    <span>
                      {item.repeatCount >= 4 ? '⚠️ ⚠️' : '🔁 ⚠️'} บันทึกซ้ำ {item.repeatCount} ครั้ง!
                    </span>
                  </span>
                )}

                <div className="flex items-center space-x-1 text-[10px] text-[#777682]">
                  {item.mastered ? (
                    <span className="text-emerald-700 font-semibold">🎯 แม่นยำ {item.accuracy}%</span>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-[#777682]" />
                      <span>{item.lastSavedText}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Word, Part of Speech, Audio */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline space-x-1.5">
                    <h4 className="text-lg font-extrabold text-[#1A146B] font-display">
                      {item.word}
                    </h4>
                    <span className="text-[11px] italic text-[#777682]">
                      {item.partOfSpeech === 'adjective' ? 'adj.' : item.partOfSpeech === 'noun' ? 'noun' : item.partOfSpeech}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777682]">{item.phonetic}</div>
                </div>

                <button
                  onClick={() => speakWord(item.word)}
                  className="p-1.5 rounded-full bg-[#F4EDE6] hover:bg-[#E2DFFF] text-[#1A146B] transition-transform active:scale-90 cursor-pointer"
                  title="ฟังการออกเสียง"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thai Meaning */}
              <p className="text-xs text-[#1E1B17] font-medium leading-snug">
                {item.meaning}
              </p>

              {/* Example Context (Compact) */}
              <div className="p-2 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB]/60">
                <div className="text-[9px] font-bold text-[#777682] uppercase tracking-wide">
                  ประโยคตัวอย่าง
                </div>
                <p className="text-[11px] text-[#474651] font-medium leading-snug">
                  "{item.exampleEn}"
                </p>
              </div>

              {/* Footer Priority and History */}
              <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-[#E8E1DB]/60">
                <div className="flex items-center space-x-1">
                  {item.mastered ? (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{item.priorityLabel}</span>
                    </span>
                  ) : isHighRepeat ? (
                    <span className="font-semibold text-[#BA1A1A] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-[#BA1A1A]" />
                      <span>{item.priorityLabel}</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-[#904D00] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#D97706]" />
                      <span>{item.priorityLabel}</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedWordForHistory(item)}
                  className="font-semibold text-[#312E81] hover:underline flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>
                    {item.mastered
                      ? `สถิติ (${item.correctCount}/${item.reviewCount})`
                      : `ประวัติ (${item.repeatCount})`}
                  </span>
                  <span>&gt;</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Prompt Bar (Bottom Actionable Card) */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30">
        {/* Dark Accent Bottom Action */}
        <div className="p-2.5 bg-white border border-[#E8E1DB] rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-2 pl-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
            <div className="text-xs font-bold text-[#1E1B17]">
              ต้องการการทบทวน: <span className="text-[#904D00]">{repeatDisplayCount} คำซ้ำที่ยังสับสน</span>
            </div>
          </div>
          <button
            onClick={() => onStartReviewSession('repeat')}
            className="px-3.5 py-1.5 rounded-xl bg-[#1A146B] text-white text-xs font-bold hover:bg-[#312E81] flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>เพิ่มรอบทบทวนคำซ้ำ</span>
          </button>
        </div>
      </div>

      {/* History Details Modal */}
      {selectedWordForHistory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-[#E8E1DB] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E1DB] pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-[#312E81]" />
                <h4 className="font-bold text-sm text-[#1E1B17]">
                  ประวัติการบันทึก: {selectedWordForHistory.word}
                </h4>
              </div>
              <button
                onClick={() => setSelectedWordForHistory(null)}
                className="p-1 rounded-full text-[#777682] hover:bg-[#F4EDE6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#FAF2EB] rounded-2xl">
                <div className="font-bold text-[#904D00] flex items-center justify-between">
                  <span>บันทึกซ้ำทั้งหมด:</span>
                  <span className="text-sm font-extrabold">{selectedWordForHistory.repeatCount} ครั้ง</span>
                </div>
                <div className="text-[11px] text-[#474651] mt-1">
                  ระบบจัดลำดับคำนี้อยู่ใน Spaced Repetition Priority สูงเพื่อกระตุ้นความจำระยะยาว (Active Recall)
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#1E1B17]">บันทึกล่าสุด:</span>
                <ul className="space-y-1 pl-2">
                  {(selectedWordForHistory.historyDates || []).map((date, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-[11px] text-[#474651]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#312E81]"></span>
                      <span>บันทึกครั้งที่ {(selectedWordForHistory.historyDates || []).length - idx}: {date}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedWordForHistory.notes && (
                <div className="p-2.5 bg-[#FBFBFA] border border-[#E8E1DB] rounded-xl text-[11px] text-[#474651]">
                  <span className="font-bold text-[#1E1B17]">โน้ตช่วยจำ: </span>
                  {selectedWordForHistory.notes}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedWordForHistory(null);
                onStartReviewSession('all');
              }}
              className="w-full py-2.5 bg-[#1A146B] text-white rounded-xl text-xs font-bold hover:bg-[#312E81] cursor-pointer"
            >
              ทบทวนคำนี้ทันที
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
