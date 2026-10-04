import React from 'react';
import { Flame, BookmarkCheck } from 'lucide-react';
import { ActiveTab, UserProfile } from '../types/vocab';

interface HeaderProps {
  activeTab: ActiveTab;
  profile: UserProfile;
  onProfileClick: () => void;
  onStreakClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  profile,
  onProfileClick,
  onStreakClick,
}) => {
  const getSubTitle = () => {
    switch (activeTab) {
      case 'add':
        return 'Add Word';
      case 'vault':
        return 'Vocabulary Vault';
      case 'review':
        return 'Flashcards Review';
      case 'profile':
        return 'Learning Profile';
      default:
        return 'Vocabulary Vault';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F2]/90 backdrop-blur-md px-4 py-3 border-b border-[#E8E1DB]/60 flex items-center justify-between transition-all">
      {/* Brand logo & screen title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#312E81] to-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-[#312E81]/15 ring-2 ring-white">
          <BookmarkCheck className="w-5 h-5 text-indigo-100" />
        </div>
        <div>
          <div className="font-bold text-lg leading-tight tracking-tight text-[#1E1B17] font-display flex items-center gap-1.5">
            LexiVault
          </div>
          <div className="text-xs font-medium text-[#777682] leading-none mt-0.5">
            {getSubTitle()}
          </div>
        </div>
      </div>

      {/* Right controls: Streak & Avatar */}
      <div className="flex items-center space-x-2.5">
        {/* Streak counter pill */}
        <button
          onClick={onStreakClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFDCC3]/80 hover:bg-[#FFDCC3] text-[#904D00] text-xs font-bold transition-all shadow-xs border border-[#FE932C]/30 active:scale-95 cursor-pointer"
          title="Streak ต่อเนื่อง 7 วัน"
        >
          <Flame className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706] animate-pulse" />
          <span>{profile.streakDays} วัน</span>
        </button>

        {/* User avatar */}
        <button
          onClick={onProfileClick}
          className="relative group p-0.5 rounded-full hover:ring-2 hover:ring-[#312E81] transition-all cursor-pointer focus:outline-none"
          title="ดูโปรไฟล์และสถิติการเรียนรู้"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FE932C]/60 shadow-xs"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#FFF8F2]"></span>
        </button>
      </div>
    </header>
  );
};
