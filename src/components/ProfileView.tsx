import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  RotateCw,
  Flame,
  Zap,
  Edit3,
  Share2,
  ChevronRight,
  ShieldCheck,
  Download,
  KeyRound,
  LogOut,
  Sparkles,
  CloudCheck,
  Check,
} from 'lucide-react';
import { UserProfile, AppSettings, VocabWord } from '../types/vocab';

interface ProfileViewProps {
  profile: UserProfile;
  settings: AppSettings;
  vocabList: VocabWord[];
  onUpdateProfile: (newProfile: Partial<UserProfile>) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onExportData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  settings,
  vocabList,
  onUpdateProfile,
  onUpdateSettings,
  onExportData,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEnglishName, setEditEnglishName] = useState(profile.englishName);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      englishName: editEnglishName,
      email: editEmail,
    });
    setIsEditingProfile(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'LexiVault - ความคืบหน้าการจำศัพท์',
          text: `ฉันจำคำศัพท์ได้แล้ว 128 คำ และทำ Streak ต่อเนื่อง 7 วันบน LexiVault! 🔥`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Toast Notice */}
      {showShareToast && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto bg-[#1A146B] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2 text-xs">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>คัดลอกลิงก์สรุปความคืบหน้าแล้ว!</span>
        </div>
      )}

      {/* Hero Profile Card */}
      <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#E8E1DB] text-center space-y-3.5">
        {/* Avatar with Lightning Badge */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-full overflow-hidden p-1 ring-4 ring-[#FE932C]/30 shadow-md mx-auto">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-md ring-2 ring-white">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* Member Badge & Info */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
            <span>⭐</span>
            <span>LexiVault Pro Member</span>
          </div>

          <h2 className="text-xl font-bold text-[#1E1B17] font-display pt-1">
            {profile.name}
          </h2>
          <div className="text-xs text-[#777682] font-medium">({profile.englishName})</div>
          <div className="text-xs text-[#777682]">{profile.email}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#FAF2EB] hover:bg-[#F4EDE6] text-[#1E1B17] text-xs font-semibold border border-[#E8E1DB] transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#777682]" />
            <span>แก้ไขโปรไฟล์</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1A146B] hover:bg-[#312E81] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>แชร์ความคืบหน้า</span>
          </button>
        </div>
      </div>

      {/* Cumulative Statistics Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#1E1B17]">
            <Sparkles className="w-4 h-4 text-[#312E81]" />
            <span className="font-display">สถิติการเรียนรู้สะสม</span>
          </div>
          <span className="text-[#777682] text-[11px]">อัปเดตล่าสุด: วันนี้</span>
        </div>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Words in Vault */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8E1DB] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#777682] font-medium">คำศัพท์ในคลัง</span>
              <div className="w-6 h-6 rounded-lg bg-[#E2DFFF] flex items-center justify-center text-[#1A146B]">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1A146B] font-display">184 คำ</div>
            <div className="text-[10px] text-[#059669] font-semibold flex items-center gap-0.5">
              <span>↗</span>
              <span>+12 คำในสัปดาห์นี้</span>
            </div>
          </div>

          {/* Card 2: Mastered */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8E1DB] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#777682] font-medium">จำได้แม่นแล้ว</span>
              <div className="w-6 h-6 rounded-lg bg-[#E6F9EE] flex items-center justify-center text-[#059669]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#00432D] font-display">
              128 <span className="text-xs font-normal text-[#777682]">คำ (69%)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E8E1DB] overflow-hidden">
              <div className="h-full bg-[#059669] rounded-full w-[69%]" />
            </div>
          </div>

          {/* Card 3: Frequent Repeats */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8E1DB] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#777682] font-medium">บันทึกซ้ำบ่อย</span>
              <div className="w-6 h-6 rounded-lg bg-[#FFDCC3] flex items-center justify-center text-[#D97706]">
                <RotateCw className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#904D00] font-display">24 คำ</div>
            <span className="inline-block px-2 py-0.5 rounded-md bg-[#FFF1D6] text-[#904D00] text-[10px] font-bold">
              Needs Review
            </span>
          </div>

          {/* Card 4: Continuous Streak */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8E1DB] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#777682] font-medium">Streak ต่อเนื่อง</span>
              <div className="w-6 h-6 rounded-lg bg-[#FFDCC3] flex items-center justify-center text-[#D97706]">
                <Flame className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1E1B17] font-display">
              7 <span className="text-xs font-normal text-[#777682]">วันติดกัน</span>
            </div>
            <div className="text-[10px] text-[#D97706] font-bold">🔥 ไฟกำลังลุกโชน!</div>
          </div>
        </div>
      </div>

      {/* Language Proportion Card */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8E1DB] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#1E1B17]">
            <span className="text-sm">🔤</span>
            <span>สัดส่วนภาษาที่บันทึก</span>
          </div>
          <span className="text-[#777682] text-[11px]">รวม 3 ภาษา</span>
        </div>

        {/* Multi-color Bar Chart */}
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#E8E1DB]">
          <div style={{ width: '82%' }} className="h-full bg-[#1A146B]" />
          <div style={{ width: '12%' }} className="h-full bg-[#FE932C]" />
          <div style={{ width: '6%' }} className="h-full bg-[#059669]" />
        </div>

        {/* Breakdown Rows */}
        <div className="space-y-2 pt-1">
          {/* Row 1: English */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF2EB]">
            <div className="flex items-center space-x-2">
              <span className="text-base">🇬🇧</span>
              <div>
                <div className="text-xs font-bold text-[#1E1B17]">อังกฤษ → ไทย</div>
                <div className="text-[10px] text-[#777682]">82% ของคลังศัพท์ทั้งหมด</div>
              </div>
            </div>
            <div className="text-xs font-bold text-[#1A146B]">151 คำ</div>
          </div>

          {/* Row 2: Japanese */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF2EB]">
            <div className="flex items-center space-x-2">
              <span className="text-base">🇯🇵</span>
              <div>
                <div className="text-xs font-bold text-[#1E1B17]">ญี่ปุ่น → ไทย</div>
                <div className="text-[10px] text-[#777682]">12% ของคลังศัพท์ทั้งหมด</div>
              </div>
            </div>
            <div className="text-xs font-bold text-[#904D00]">22 คำ</div>
          </div>

          {/* Row 3: Chinese */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF2EB]">
            <div className="flex items-center space-x-2">
              <span className="text-base">🇨🇳</span>
              <div>
                <div className="text-xs font-bold text-[#1E1B17]">จีน → ไทย</div>
                <div className="text-[10px] text-[#777682]">6% ของคลังศัพท์ทั้งหมด</div>
              </div>
            </div>
            <div className="text-xs font-bold text-[#059669]">11 คำ</div>
          </div>
        </div>
      </div>

      {/* Settings Card: Memorization & Review */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8E1DB] shadow-xs space-y-3.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#1E1B17]">
          <span className="text-sm">🎛️</span>
          <span>การตั้งค่าการจำ & ทบทวน</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Switch 1: Daily Spaced Repetition Reminder */}
          <div className="flex items-center justify-between">
            <div className="pr-2">
              <div className="font-semibold text-[#1E1B17]">
                แจ้งเตือนคำศัพท์ซ้ำบ่อยรายวัน
              </div>
              <div className="text-[11px] text-[#777682]">
                ส่งการ์ดทบทวน Spaced Repetition ตอน 20:00 น.
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ dailyReminder: !settings.dailyReminder })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.dailyReminder ? 'bg-[#1A146B]' : 'bg-[#E8E1DB]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.dailyReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="w-full h-[1px] bg-[#E8E1DB]/60" />

          {/* Switch 2: Auto-pronunciation */}
          <div className="flex items-center justify-between">
            <div className="pr-2">
              <div className="font-semibold text-[#1E1B17]">Auto-pronunciation</div>
              <div className="text-[11px] text-[#777682]">
                ออกเสียงคำศัพท์อัตโนมัติเมื่อพลิกการ์ด
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoPronounce: !settings.autoPronounce })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.autoPronounce ? 'bg-[#1A146B]' : 'bg-[#E8E1DB]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.autoPronounce ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="w-full h-[1px] bg-[#E8E1DB]/60" />

          {/* Select: Dictionary API connection */}
          <div className="flex items-center justify-between">
            <div className="pr-2">
              <div className="font-semibold text-[#1E1B17]">เชื่อมต่อ Dictionary API</div>
              <div className="text-[11px] text-[#777682]">
                ดึงความหมายและตัวอย่างประโยคอัตโนมัติ
              </div>
            </div>
            <select
              value={settings.dictionaryApi}
              onChange={(e) => onUpdateSettings({ dictionaryApi: e.target.value })}
              className="px-2.5 py-1.5 rounded-xl bg-[#FAF2EB] text-[#1E1B17] text-xs font-semibold border border-[#E8E1DB] focus:outline-none focus:border-[#312E81] cursor-pointer"
            >
              <option value="Free Dictionary API">Free Dictionary API</option>
              <option value="Oxford API (Cloud)">Oxford API (Cloud)</option>
              <option value="Merriam-Webster">Merriam-Webster</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-3xl border border-[#E8E1DB] shadow-xs overflow-hidden divide-y divide-[#E8E1DB]/60 text-xs">
        {/* Change password */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF2EB] transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF2EB] flex items-center justify-center text-[#777682]">
              <KeyRound className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[#1E1B17]">เปลี่ยนรหัสผ่าน</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#777682]" />
        </button>

        {/* Backup / Export CSV or JSON */}
        <button
          onClick={onExportData}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF2EB] transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF2EB] flex items-center justify-center text-[#777682]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#1E1B17]">สำรองข้อมูลคลังคำศัพท์</div>
              <div className="text-[10px] text-[#777682]">
                ส่งออกเป็นไฟล์ CSV หรือ JSON (184 คำ)
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-[#E2DFFF] text-[#1A146B] text-[10px] font-bold">
              CSV / JSON
            </span>
            <ChevronRight className="w-4 h-4 text-[#777682]" />
          </div>
        </button>

        {/* Log Out */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFE4E8]/50 transition-colors text-[#BA1A1A] cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFE4E8] flex items-center justify-center text-[#BA1A1A]">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-bold">ออกจากระบบ (Log Out)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#BA1A1A]" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-1 pt-2 pb-2">
        <div className="flex items-center justify-center space-x-1.5 text-xs text-[#059669]">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
          <span>คลังคำศัพท์ซิงค์กับคลาวด์แล้ว</span>
        </div>
        <div className="text-[10px] text-[#777682]">
          LexiVault v2.4.0 (Build 382) • Smart Spaced Repetition Engine
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-xl border border-[#E8E1DB]">
            <h4 className="font-bold text-sm text-[#1E1B17]">แก้ไขข้อมูลโปรไฟล์</h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[#777682] mb-1">ชื่อภาษาไทย</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81]"
                />
              </div>
              <div>
                <label className="block text-[#777682] mb-1">ชื่อภาษาอังกฤษ</label>
                <input
                  type="text"
                  value={editEnglishName}
                  onChange={(e) => setEditEnglishName(e.target.value)}
                  className="w-full p-2 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81]"
                />
              </div>
              <div>
                <label className="block text-[#777682] mb-1">อีเมล</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-2 rounded-xl bg-[#F4EDE6] text-xs font-semibold text-[#1E1B17]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2 rounded-xl bg-[#1A146B] text-xs font-semibold text-white hover:bg-[#312E81]"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-xl border border-[#E8E1DB]">
            <h4 className="font-bold text-sm text-[#1E1B17]">เปลี่ยนรหัสผ่านความปลอดภัย</h4>
            <div className="space-y-2 text-xs">
              <input
                type="password"
                placeholder="รหัสผ่านปัจจุบัน"
                className="w-full p-2 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81]"
              />
              <input
                type="password"
                placeholder="รหัสผ่านใหม่"
                className="w-full p-2 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81]"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#F4EDE6] text-xs font-semibold text-[#1E1B17]"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#1A146B] text-xs font-semibold text-white"
              >
                ยืนยันเปลี่ยนรหัส
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Dialog */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl border border-[#E8E1DB] text-center">
            <h4 className="font-bold text-sm text-[#1E1B17]">ต้องการออกจากระบบ?</h4>
            <p className="text-xs text-[#777682]">
              ข้อมูลคำศัพท์ทั้งหมดจะถูกซิงค์จัดเก็บปลอดภัยบนคลาวด์ คุณสามารถกลับมาเข้าสู่ระบบเพื่อทบทวนได้ทุกเมื่อ
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#F4EDE6] text-xs font-semibold text-[#1E1B17]"
              >
                อยู่ต่อ
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#BA1A1A] text-xs font-semibold text-white"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
