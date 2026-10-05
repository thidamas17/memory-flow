import React, { useState, useEffect } from 'react';
import { X, FileEdit, Check } from 'lucide-react';
import { VocabWord } from '../types/vocab';

interface EditNoteModalProps {
  word: VocabWord | null;
  onClose: () => void;
  onSave: (updatedWord: VocabWord) => void;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  word,
  onClose,
  onSave,
}) => {
  if (!word) return null;

  const [meaning, setMeaning] = useState(word.meaning);
  const [notes, setNotes] = useState(word.notes || '');

  useEffect(() => {
    if (word) {
      setMeaning(word.meaning);
      setNotes(word.notes || '');
    }
  }, [word]);

  const handleSave = () => {
    onSave({
      ...word,
      meaning: meaning,
      notes: notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-[#E8E1DB] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E8E1DB] pb-3">
          <div className="flex items-center space-x-2">
            <FileEdit className="w-5 h-5 text-[#312E81]" />
            <h4 className="font-bold text-sm text-[#1E1B17]">
              แก้ไขโน้ตคำศัพท์: {word.word}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#777682] hover:bg-[#F4EDE6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[#1E1B17] font-semibold mb-1">
              ความหมาย / คำแปล
            </label>
            <textarea
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81] text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-[#1E1B17] font-semibold mb-1">
              โน้ตช่วยจำส่วนตัว (Mnemonic Note)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="พิมพ์คำใบ้ ทริคการจำ หรือบริบทที่พบบ่อย..."
              className="w-full p-2.5 bg-[#FAF2EB] rounded-xl border border-[#E8E1DB] focus:outline-none focus:border-[#312E81] text-xs resize-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-[#F4EDE6] text-xs font-semibold text-[#1E1B17] cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-[#1A146B] text-xs font-semibold text-white hover:bg-[#312E81] flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>บันทึกโน้ต</span>
          </button>
        </div>
      </div>
    </div>
  );
};
