/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, VocabWord, UserProfile, AppSettings } from './types/vocab';
import {
  initialVocabList,
  initialProfile,
  initialSettings,
} from './data/initialVocab';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AddWordView } from './components/AddWordView';
import { VaultView } from './components/VaultView';
import { ReviewView } from './components/ReviewView';
import { ProfileView } from './components/ProfileView';
import { ExportModal } from './components/ExportModal';
import { EditNoteModal } from './components/EditNoteModal';
import { speakWord } from './services/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('add');
  const [vocabList, setVocabList] = useState<VocabWord[]>(() => {
    try {
      const saved = localStorage.getItem('lexivault_words');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialVocabList;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('lexivault_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialProfile;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('lexivault_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialSettings;
  });

  const [reviewFilter, setReviewFilter] = useState<'all' | 'repeat'>('all');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lexivault_words', JSON.stringify(vocabList));
    } catch {}
  }, [vocabList]);

  useEffect(() => {
    try {
      localStorage.setItem('lexivault_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('lexivault_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Handler for adding word (or incrementing duplicate)
  const handleAddWord = (word: VocabWord, isDuplicate: boolean) => {
    setVocabList((prev) => {
      if (isDuplicate) {
        return prev.map((item) => {
          if (item.word.toLowerCase() === word.word.toLowerCase()) {
            return {
              ...item,
              repeatCount: item.repeatCount + 1,
              priority: 'high',
              priorityLabel: 'สูงมาก (ทบทวนทุกวัน)',
              lastSavedText: 'เมื่อสักครู่',
              historyDates: ['เมื่อสักครู่', ...item.historyDates],
              nextReviewDays: 1,
            };
          }
          return item;
        });
      } else {
        return [word, ...prev];
      }
    });

    if (settings.autoPronounce) {
      speakWord(word.word);
    }
  };

  // Handler for updating review result
  const handleUpdateWordReview = (wordId: string, remembered: boolean) => {
    setVocabList((prev) =>
      prev.map((item) => {
        if (item.id === wordId) {
          const newReviewCount = (item.reviewCount || 0) + 1;
          const newCorrectCount = (item.correctCount || 0) + (remembered ? 1 : 0);
          const newAccuracy = Math.round((newCorrectCount / newReviewCount) * 100);

          return {
            ...item,
            reviewCount: newReviewCount,
            correctCount: newCorrectCount,
            accuracy: newAccuracy,
            mastered: remembered ? newAccuracy >= 85 && newReviewCount >= 5 : false,
            priority: remembered ? 'medium' : 'high',
            priorityLabel: remembered
              ? 'ปานกลาง (ทบทวนทุก 3 วัน)'
              : 'สูงมาก (ทบทวนทุกวัน)',
            nextReviewDays: remembered ? item.nextReviewDays + 2 : 1,
          };
        }
        return item;
      })
    );
  };

  // Start review directly with filtered repeat cards or all
  const handleStartReviewSession = (filterMode: 'all' | 'repeat') => {
    setReviewFilter(filterMode);
    setActiveTab('review');
  };

  const handleUpdateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSaveEditedWord = (updatedWord: VocabWord) => {
    setVocabList((prev) =>
      prev.map((item) => (item.id === updatedWord.id ? updatedWord : item))
    );
  };

  return (
    <div className="min-h-screen bg-[#F4EDE6]/60 flex justify-center selection:bg-[#312E81] selection:text-white">
      {/* Mobile-first ergonomic container */}
      <div className="w-full max-w-md bg-[#FFF8F2] min-h-screen flex flex-col relative shadow-xl shadow-stone-900/5 border-x border-[#E8E1DB]">
        {/* Sticky App Header */}
        <Header
          activeTab={activeTab}
          profile={profile}
          onProfileClick={() => setActiveTab('profile')}
          onStreakClick={() => setActiveTab('review')}
        />

        {/* Tab Views */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'add' && (
            <AddWordView
              vocabList={vocabList}
              onAddWord={handleAddWord}
              onNavigateToVault={() => setActiveTab('vault')}
            />
          )}

          {activeTab === 'vault' && (
            <VaultView
              vocabList={vocabList}
              onStartReviewSession={handleStartReviewSession}
            />
          )}

          {activeTab === 'review' && (
            <ReviewView
              vocabList={vocabList}
              initialFilter={reviewFilter}
              onUpdateWordReview={handleUpdateWordReview}
              onEditNote={(word) => setEditingWord(word)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              settings={settings}
              vocabList={vocabList}
              onUpdateProfile={handleUpdateProfile}
              onUpdateSettings={handleUpdateSettings}
              onExportData={() => setIsExportOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'review') setReviewFilter('all');
            setActiveTab(tab);
          }}
        />

        {/* Modals */}
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          vocabList={vocabList}
        />

        <EditNoteModal
          word={editingWord}
          onClose={() => setEditingWord(null)}
          onSave={handleSaveEditedWord}
        />
      </div>
    </div>
  );
}
