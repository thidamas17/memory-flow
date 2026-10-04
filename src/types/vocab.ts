export type PartOfSpeech = 'adjective' | 'noun' | 'verb' | 'adverb';

export interface VisualMnemonic {
  enabled?: boolean;
  imageUrl?: string;
  caption?: string;
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  partOfSpeechTh: string;
  meaning: string;
  exampleEn: string;
  exampleTh: string;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  language: 'en-th' | 'ja-th' | 'zh-th';
  mnemonic?: VisualMnemonic;
  repeatCount: number; // e.g., 1 (normal), 3, 4 (repeatedly saved)
  mastered: boolean;
  accuracy: number; // e.g. 98%
  priority: 'high' | 'medium' | 'low';
  priorityLabel: string; // e.g. "สูงมาก (ทบทวนทุกวัน)", "ปานกลาง (ทบทวนทุก 3 วัน)"
  lastSavedText: string; // e.g. "2 ชม. ที่แล้ว", "เมื่อวานนี้"
  historyDates: string[]; // Timestamps of saves
  nextReviewDays: number;
  reviewCount: number;
  correctCount: number;
  notes?: string;
}

export type ActiveTab = 'review' | 'add' | 'vault' | 'profile';

export interface UserProfile {
  name: string;
  englishName: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
  streakDays: number;
  streakStatus: string;
}

export interface ReviewSessionState {
  currentIndex: number;
  isFlipped: boolean;
  reviewedTodayCount: number;
  masteredTodayCount: number;
  needsRepeatTodayCount: number;
  filter: 'all' | 'repeat' | 'en';
}

export interface AppSettings {
  dailyReminder: boolean;
  reminderTime: string;
  autoPronounce: boolean;
  dictionaryApi: string;
}
