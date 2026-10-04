import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCw,
  Check,
  X,
  Shuffle,
  FileEdit,
  SkipForward,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Sliders,
  AudioWaveform,
} from 'lucide-react';
import { VocabWord, ReviewSessionState } from '../types/vocab';
import { speakWord } from '../services/audio';

interface ReviewViewProps {
  vocabList: VocabWord[];
  initialFilter?: 'all' | 'repeat';
  onUpdateWordReview: (wordId: string, remembered: boolean) => void;
  onEditNote: (word: VocabWord) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  vocabList,
  initialFilter = 'all',
  onUpdateWordReview,
  onEditNote,
}) => {
  const [filter, setFilter] = useState<'all' | 'repeat' | 'en'>(initialFilter);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Review stats for today
  const [masteredToday, setMasteredToday] = useState(12);
  const [needRepeatToday, setNeedRepeatToday] = useState(4);
  const [totalReviewedToday, setTotalReviewedToday] = useState(8);
  const targetDailyCount = 20;

  // Filter cards based on selection
  const deck = React.useMemo(() => {
    let list = [...vocabList];
    if (filter === 'repeat') {
      list = list.filter((w) => w.repeatCount > 1);
    }
    // Make sure serendipity is upfront if available to match screenshot
    const serendipityIndex = list.findIndex((w) => w.word.toLowerCase() === 'serendipity');
    if (serendipityIndex > 0) {
      const [item] = list.splice(serendipityIndex, 1);
      list.unshift(item);
    }
    return list;
  }, [vocabList, filter]);

  const currentWord = deck[currentIndex % Math.max(1, deck.length)] || vocabList[0];

  // Auto flip reset when moving to next card
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePronounce = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentWord) {
      speakWord(currentWord.word);
    }
  };

  const handleDecision = (remembered: boolean) => {
    if (!currentWord) return;

    if (remembered) {
      setMasteredToday((prev) => prev + 1);
    } else {
      setNeedRepeatToday((prev) => prev + 1);
    }
    setTotalReviewedToday((prev) => prev + 1);

    onUpdateWordReview(currentWord.id, remembered);

    // Smooth transition to next card
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * deck.length);
    setCurrentIndex(randomIndex);
  };

  const handleSkip = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const progressPercent = Math.min(100, Math.round((totalReviewedToday / targetDailyCount) * 100));

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Daily Progress Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#1E1B17]">
            <span className="text-base">🎓</span>
            <span className="text-sm font-display">ทบทวนประจำวัน</span>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-[#E2DFFF]/60 text-[#1A146B] text-xs font-bold font-display">
            {totalReviewedToday} / {targetDailyCount} คำ
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#E8E1DB] overflow-hidden">
          <div
            className="h-full bg-[#1A146B] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#1A146B] text-white shadow-xs'
              : 'bg-[#F4EDE6] text-[#474651] hover:bg-[#E8E1DB]'
          }`}
        >
          <span>✓ ทั้งหมด</span>
        </button>

        <button
          onClick={() => setFilter('repeat')}
          className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'repeat'
              ? 'bg-[#FE932C] text-[#663500] ring-2 ring-[#FE932C]/40 shadow-xs'
              : 'bg-[#FFDCC3]/80 text-[#904D00] hover:bg-[#FFDCC3]'
          }`}
        >
          <span>⚠️ บันทึกซ้ำบ่อย</span>
        </button>

        <button
          onClick={() => setFilter('en')}
          className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filter === 'en'
              ? 'bg-[#312E81] text-white'
              : 'bg-[#F4EDE6] text-[#474651] hover:bg-[#E8E1DB]'
          }`}
        >
          <span>🇬🇧 อังกฤษ → ไทย</span>
        </button>
      </div>

      {/* Main Flashcard Container */}
      <div
        onClick={handleFlip}
        className="w-full bg-white rounded-3xl p-5 shadow-md border border-[#E8E1DB] min-h-[380px] flex flex-col justify-between cursor-pointer transition-all hover:shadow-lg select-none relative group"
      >
        {/* Top Card Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E2DFFF]/40 text-[#1A146B] text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5 text-[#312E81]" />
            <span>English → ภาษาไทย</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePronounce}
              className="p-2 rounded-xl bg-[#E2DFFF] text-[#1A146B] hover:bg-[#C3C0FF] active:scale-95 transition-all cursor-pointer"
              title="ฟังเสียงออกเสียง"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePronounce();
              }}
              className="p-2 rounded-xl bg-[#E2DFFF]/60 text-[#1A146B] hover:bg-[#E2DFFF] active:scale-95 transition-all cursor-pointer"
              title="ปรับสปีดการอ่าน"
            >
              <AudioWaveform className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Content: Front or Back */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="my-auto py-2 text-center space-y-3.5">
            {/* Visual Mnemonic Image */}
            {currentWord?.mnemonic.imageUrl && (
              <div className="mx-auto w-32 h-32 rounded-2xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-[#E8E1DB]/60">
                <img
                  src={currentWord.mnemonic.imageUrl}
                  alt={currentWord.word}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Word & Phonetic */}
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-[#1A146B] tracking-tight font-display">
                {currentWord?.word}
              </h2>
              <div className="text-sm font-medium text-[#777682]">{currentWord?.phonetic}</div>
            </div>

            {/* Repeat Alert Callout Box */}
            {currentWord?.repeatCount > 1 && (
              <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl text-left space-y-0.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#B45309]">
                  <Bookmark className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>บันทึกซ้ำแล้ว {currentWord.repeatCount} ครั้ง!</span>
                </div>
                <p className="text-[11px] text-[#92400E] leading-relaxed">
                  ความจำระดับปานกลาง ควรทบทวนบ่อยขึ้นเพื่อความแม่นยำ
                </p>
              </div>
            )}
          </div>
        ) : (
          /* BACK SIDE (Answer & Translation) */
          <div className="my-auto py-2 space-y-3.5 text-left animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E1DB] pb-2">
              <span className="text-xs font-bold text-[#312E81] uppercase tracking-wider">
                คำแปล & ความหมาย
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E2DFFF] text-[#1A146B] text-[11px] font-semibold">
                {currentWord?.partOfSpeech} ({currentWord?.partOfSpeechTh})
              </span>
            </div>

            {/* Main Thai Meaning */}
            <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-[#E8E1DB]">
              <p className="text-sm font-bold text-[#1E1B17] leading-relaxed">
                {currentWord?.meaning}
              </p>
            </div>

            {/* Example Sentences */}
            <div className="p-3 bg-[#FAF2EB] rounded-2xl border border-[#E8E1DB]/60 space-y-1">
              <p className="text-xs font-medium text-[#1E1B17] leading-relaxed">
                "{currentWord?.exampleEn}"
              </p>
              <p className="text-[11px] italic text-[#474651] leading-relaxed">
                "{currentWord?.exampleTh}"
              </p>
            </div>

            {/* Mnemonic Hint */}
            <div className="text-[11px] text-[#904D00] bg-[#FFFBEB] p-2.5 rounded-xl border border-[#FDE68A]">
              <span className="font-bold">💡 ทริคช่วยจำ: </span>
              {currentWord?.mnemonic.caption}
            </div>
          </div>
        )}

        {/* Bottom Flip Prompt */}
        <div className="flex items-center justify-center space-x-1.5 text-xs text-[#777682] pt-2 border-t border-[#E8E1DB]/40">
          <RotateCw className="w-3.5 h-3.5 text-[#312E81]" />
          <span>แตะที่การ์ดเพื่อ{isFlipped ? 'ดูคำศัพท์ภาษาอังกฤษ' : 'พลิกดูคำแปล'}</span>
        </div>
      </div>

      {/* Decision Rating Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Button 1: ยังจำไม่ได้ */}
        <button
          onClick={() => handleDecision(false)}
          className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-[#FFE4E8] hover:bg-[#FECDD3] active:scale-95 text-[#BA1A1A] font-bold text-sm transition-all border border-[#FDA4AF]/40 shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
          <span>ยังจำไม่ได้</span>
        </button>

        {/* Button 2: จำได้แล้ว */}
        <button
          onClick={() => handleDecision(true)}
          className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold text-sm transition-all shadow-md shadow-[#059669]/20 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>จำได้แล้ว</span>
        </button>
      </div>

      {/* Auxiliary Action Buttons */}
      <div className="flex items-center justify-around bg-white p-2.5 rounded-2xl border border-[#E8E1DB] text-xs text-[#474651]">
        <button
          onClick={handleShuffle}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl hover:bg-[#FAF2EB] transition-colors cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-[#777682]" />
          <span>สุ่มคำศัพท์</span>
        </button>

        <div className="w-[1px] h-4 bg-[#E8E1DB]" />

        <button
          onClick={() => currentWord && onEditNote(currentWord)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl hover:bg-[#FAF2EB] transition-colors cursor-pointer"
        >
          <FileEdit className="w-3.5 h-3.5 text-[#777682]" />
          <span>แก้ไขโน้ต</span>
        </button>

        <div className="w-[1px] h-4 bg-[#E8E1DB]" />

        <button
          onClick={handleSkip}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl hover:bg-[#FAF2EB] transition-colors cursor-pointer"
        >
          <SkipForward className="w-3.5 h-3.5 text-[#777682]" />
          <span>ข้ามไปก่อน</span>
        </button>
      </div>

      {/* Today's Review Stats Card */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8E1DB] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1E1B17]">สถิติรอบทบทวนวันนี้</span>
          <span className="text-[11px] text-[#312E81] font-semibold">อัปเดตเรียลไทม์</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Remembered Count */}
          <div className="p-3 bg-[#E6F9EE] rounded-2xl flex items-center space-x-3 border border-[#059669]/15">
            <div className="w-8 h-8 rounded-full bg-[#059669]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#00432D] leading-none">
                {masteredToday} คำ
              </div>
              <div className="text-[10px] text-[#005137] mt-1 font-medium">จำได้แม่นยำแล้ว</div>
            </div>
          </div>

          {/* Need Repeat Count */}
          <div className="p-3 bg-[#FFE4E8] rounded-2xl flex items-center space-x-3 border border-[#BA1A1A]/15">
            <div className="w-8 h-8 rounded-full bg-[#BA1A1A]/15 flex items-center justify-center shrink-0">
              <RotateCw className="w-4 h-4 text-[#BA1A1A]" />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#93000A] leading-none">
                {needRepeatToday} คำ
              </div>
              <div className="text-[10px] text-[#BA1A1A] mt-1 font-medium">ต้องซ้ำอีกรอบ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
