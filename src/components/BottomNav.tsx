import React from 'react';
import { Layers, Plus, BookMarked, User } from 'lucide-react';
import { ActiveTab } from '../types/vocab';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF8F2]/95 backdrop-blur-lg border-t border-[#E8E1DB] max-w-md mx-auto shadow-lg shadow-black/5">
      <div className="flex items-center justify-around h-16 px-3">
        {/* Tab 1: ทบทวน (Review) */}
        <button
          onClick={() => onTabChange('review')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'review'
              ? 'text-[#1A146B] font-bold'
              : 'text-[#777682] hover:text-[#1E1B17]'
          }`}
        >
          <div className="relative">
            <Layers className={`w-5 h-5 transition-transform ${activeTab === 'review' ? 'scale-110' : ''}`} />
            {activeTab === 'review' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1A146B]"></span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-display">ทบทวน</span>
        </button>

        {/* Tab 2: เพิ่มศัพท์ (Add Word - Center Highlighted) */}
        <button
          onClick={() => onTabChange('add')}
          className="flex flex-col items-center justify-center flex-1 py-1 group cursor-pointer"
        >
          <div
            className={`w-10 h-10 -mt-2 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
              activeTab === 'add'
                ? 'bg-[#1A146B] text-white shadow-[#1A146B]/30 ring-4 ring-[#FFF8F2]'
                : 'bg-[#312E81] text-white group-hover:bg-[#1A146B]'
            }`}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span
            className={`text-[11px] mt-0.5 font-display ${
              activeTab === 'add' ? 'text-[#1A146B] font-bold' : 'text-[#777682]'
            }`}
          >
            เพิ่มศัพท์
          </span>
        </button>

        {/* Tab 3: คลังศัพท์ (Vault) */}
        <button
          onClick={() => onTabChange('vault')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'vault'
              ? 'text-[#1A146B] font-bold'
              : 'text-[#777682] hover:text-[#1E1B17]'
          }`}
        >
          <div className="relative">
            <BookMarked className={`w-5 h-5 transition-transform ${activeTab === 'vault' ? 'scale-110' : ''}`} />
            {activeTab === 'vault' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1A146B]"></span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-display">คลังศัพท์</span>
        </button>

        {/* Tab 4: โปรไฟล์ (Profile) */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#1A146B] font-bold'
              : 'text-[#777682] hover:text-[#1E1B17]'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
            {activeTab === 'profile' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1A146B]"></span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-display">โปรไฟล์</span>
        </button>
      </div>
    </nav>
  );
};
