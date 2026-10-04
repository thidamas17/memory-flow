import React, { useState } from 'react';
import { X, FileSpreadsheet, FileJson, Check, Download } from 'lucide-react';
import { VocabWord } from '../types/vocab';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabList: VocabWord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  vocabList,
}) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadCSV = () => {
    const headers = ['Word', 'Phonetic', 'Part of Speech', 'Meaning (Thai)', 'Example (English)', 'Example (Thai)', 'CEFR', 'Repeat Count', 'Mastered'];
    const rows = vocabList.map((item) => [
      `"${item.word.replace(/"/g, '""')}"`,
      `"${item.phonetic.replace(/"/g, '""')}"`,
      `"${item.partOfSpeech}"`,
      `"${item.meaning.replace(/"/g, '""')}"`,
      `"${item.exampleEn.replace(/"/g, '""')}"`,
      `"${item.exampleTh.replace(/"/g, '""')}"`,
      `"${item.cefr}"`,
      item.repeatCount,
      item.mastered ? 'Yes' : 'No',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lexivault_words_backup_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFormat('CSV');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(vocabList, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lexivault_words_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFormat('JSON');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-[#E8E1DB] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E8E1DB] pb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-[#312E81]" />
            <h4 className="font-bold text-sm text-[#1E1B17]">สำรองข้อมูลคลังคำศัพท์</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#777682] hover:bg-[#F4EDE6]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#474651] leading-relaxed">
          เลือกรูปแบบไฟล์ที่ต้องการส่งออกข้อมูลคำศัพท์ทั้งหมดในคลัง (รวม {vocabList.length} รายการและสถิติการจำซ้ำ):
        </p>

        {downloadedFormat && (
          <div className="p-2.5 bg-[#E6F9EE] rounded-xl border border-[#059669]/20 flex items-center space-x-2 text-xs text-[#00432D]">
            <Check className="w-4 h-4 text-[#059669]" />
            <span>ส่งออกไฟล์ {downloadedFormat} สำเร็จแล้ว!</span>
          </div>
        )}

        <div className="space-y-2.5">
          {/* CSV Option */}
          <button
            onClick={downloadCSV}
            className="w-full p-3.5 rounded-2xl bg-[#FAF2EB] hover:bg-[#F4EDE6] border border-[#E8E1DB] flex items-center justify-between transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E1B17] group-hover:text-[#312E81]">
                  ไฟล์ตาราง CSV (.csv)
                </div>
                <div className="text-[11px] text-[#777682]">
                  เปิดได้ด้วย Excel, Numbers, Google Sheets
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#777682] group-hover:text-[#312E81]" />
          </button>

          {/* JSON Option */}
          <button
            onClick={downloadJSON}
            className="w-full p-3.5 rounded-2xl bg-[#FAF2EB] hover:bg-[#F4EDE6] border border-[#E8E1DB] flex items-center justify-between transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E1B17] group-hover:text-[#312E81]">
                  ไฟล์ชุดข้อมูล JSON (.json)
                </div>
                <div className="text-[11px] text-[#777682]">
                  เหมาะสำหรับนำเข้าแอปพลิเคชันหรือเก็บสำรอง
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#777682] group-hover:text-[#312E81]" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#1A146B] text-white rounded-xl text-xs font-bold hover:bg-[#312E81] cursor-pointer"
        >
          เสร็จสิ้น
        </button>
      </div>
    </div>
  );
};
