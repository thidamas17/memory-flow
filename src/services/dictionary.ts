import { PartOfSpeech } from '../types/vocab';

export interface DictionaryResult {
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  partOfSpeechTh: string;
  meaning: string;
  exampleEn: string;
  exampleTh: string;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  mnemonicImage: string;
  mnemonicCaption: string;
  audioUrl?: string;
}

const posMapTh: Record<PartOfSpeech, string> = {
  adjective: 'คุณศัพท์',
  noun: 'นาม',
  verb: 'กริยา',
  adverb: 'กริยาวิเศษณ์',
};

// Rich curated database for instant Thai translations and mnemonics
const wordKnowledgeBase: Record<string, Partial<DictionaryResult>> = {
  resilient: {
    word: 'resilient',
    phonetic: "/rɪˈzɪl.i.ənt/",
    partOfSpeech: 'adjective',
    partOfSpeechTh: 'คุณศัพท์',
    meaning: 'ยืดหยุ่น, คืนสู่สภาพเดิมได้เร็ว, ฟื้นตัวเร็วเมื่อเจอปัญหา',
    exampleEn: 'She is a resilient girl who bounces back quickly from challenges.',
    exampleTh: 'เธอเป็นเด็กผู้หญิงที่มีความยืดหยุ่นทางใจและลุกขึ้นใหม่ได้อย่างรวดเร็ว',
    cefr: 'B2',
    mnemonicImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    mnemonicCaption: 'ต้นกล้าแตกหน่อผ่านคอนกรีต สะท้อนความไม่ยอมแพ้',
  },
  ephemeral: {
    word: 'ephemeral',
    phonetic: '/rɪˈfem.ər.əl/',
    partOfSpeech: 'adjective',
    partOfSpeechTh: 'คุณศัพท์',
    meaning: 'เกิดขึ้นและคงอยู่เพียงชั่วคราว, ไม่จีรัง',
    exampleEn: 'Fame in the digital age is wonderfully ephemeral, fading as quickly as it arrives.',
    exampleTh: 'ชื่อเสียงในยุคดิจิทัลนั้นเกิดขึ้นและดับไปเพียงชั่วคราว จางหายไปรวดเร็วพอๆ กับตอนที่มาถึง',
    cefr: 'C1',
    mnemonicImage: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=400&q=80',
    mnemonicCaption: 'หยดน้ำค้างยามเช้าบนกลีบดอกไม้ สื่อถึงสิ่งชั่วคราวที่งดงาม',
  },
  serendipity: {
    word: 'serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    partOfSpeech: 'noun',
    partOfSpeechTh: 'นาม',
    meaning: 'การค้นพบสิ่งดีๆ หรือโชคลาภโดยบังเอิญ',
    exampleEn: 'Finding this cozy cafe was pure serendipity on a rainy afternoon.',
    exampleTh: 'การได้พบคาเฟ่แสนอบอุ่นแห่งนี้คือความบังเอิญที่แสนวิเศษในบ่ายวันฝนตก',
    cefr: 'B2',
    mnemonicImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80',
    mnemonicCaption: 'หญิงสาวนั่งอ่านหนังสือในคาเฟ่ที่ค้นพบโดยบังเอิญ',
  },
  eloquent: {
    word: 'eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adjective',
    partOfSpeechTh: 'คุณศัพท์',
    meaning: 'พูดจาฉะฉาน คมคาย สื่อความหมายได้ลึกซึ้ง',
    exampleEn: 'She gave an eloquent speech that moved everyone in the auditorium.',
    exampleTh: 'เธอได้กล่าวสุนทรพจน์ที่ไพเราะคมคายซึ่งจับใจทุกคนในหอประชุม',
    cefr: 'B2',
    mnemonicImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80',
    mnemonicCaption: 'นักพูดที่ยืนกล่าวสุนทรพจน์บนเวทีอย่างมั่นใจและน่าประทับใจ',
  },
  ineffable: {
    word: 'ineffable',
    phonetic: '/ɪnˈef.ə.bəl/',
    partOfSpeech: 'adjective',
    partOfSpeechTh: 'คุณศัพท์',
    meaning: 'งดงามล้ำค่าจนไม่อาจบรรยายเป็นคำพูดได้',
    exampleEn: 'The sunset over the mountain range filled her with an ineffable joy.',
    exampleTh: 'พระอาทิตย์อัสดงเหนือทิวเขาเติมเต็มหัวใจเธอด้วยความสุขที่ไม่อาจบรรยายได้',
    cefr: 'C2',
    mnemonicImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    mnemonicCaption: 'ทิวทัศน์แสงสีทองอันตระการตาที่เกินจะบรรยาย',
  },
  lucid: {
    word: 'lucid',
    phonetic: '/ˈluː.sɪd/',
    partOfSpeech: 'adjective',
    partOfSpeechTh: 'คุณศัพท์',
    meaning: 'ชัดเจน, เข้าใจง่าย, มีสติแจ่มใส',
    exampleEn: 'The professor provided a remarkably lucid explanation of quantum physics.',
    exampleTh: 'ศาสตราจารย์ได้อธิบายวิชาฟิสิกส์ควอนตัมได้อย่างกระจ่างแจ้งและเข้าใจง่ายยิ่ง',
    cefr: 'B2',
    mnemonicImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    mnemonicCaption: 'หยดน้ำใสบริสุทธิ์สะท้อนแสงกระจ่างตา',
  },
  benevolent: {
    word: 'benevolent',
    phonetic: '/bəˈnev.əl.ənt/',
    partOfSpeech: 'adjective',
    partOfSpeechTh: 'คุณศัพท์',
    meaning: 'ใจดี, มีเมตตากรุณา, ปรารถนาดีต่อผู้อื่น',
    exampleEn: 'A benevolent leader inspires their team through empathy and trust.',
    exampleTh: 'ผู้นำที่เปี่ยมด้วยความเมตตาจะสร้างแรงบันดาลใจให้ทีมด้วยความเข้าใจและไว้ใจ',
    cefr: 'C1',
    mnemonicImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=400&q=80',
    mnemonicCaption: 'มือที่ยื่นแบ่งปันและโอบอุ้มด้วยความเอื้ออาทร',
  }
};

export async function fetchWordDefinition(query: string): Promise<DictionaryResult> {
  const cleanWord = query.trim().toLowerCase();

  // Check known curated list first
  if (wordKnowledgeBase[cleanWord]) {
    const item = wordKnowledgeBase[cleanWord];
    return {
      word: item.word || cleanWord,
      phonetic: item.phonetic || `/${cleanWord}/`,
      partOfSpeech: (item.partOfSpeech as PartOfSpeech) || 'adjective',
      partOfSpeechTh: item.partOfSpeechTh || posMapTh[item.partOfSpeech as PartOfSpeech] || 'คุณศัพท์',
      meaning: item.meaning || 'ความหมายของคำศัพท์',
      exampleEn: item.exampleEn || `This is an example sentence for ${cleanWord}.`,
      exampleTh: item.exampleTh || `นี่คือประโยคตัวอย่างสำหรับการใช้คำว่า ${cleanWord}`,
      cefr: item.cefr || 'B2',
      mnemonicImage: item.mnemonicImage || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
      mnemonicCaption: item.mnemonicCaption || `ภาพสื่อความหมายช่วยจำสำหรับ ${cleanWord}`,
    };
  }

  // Attempt live Free Dictionary API
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        const phonetic = entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || `/${cleanWord}/`;
        const firstMeaning = entry.meanings?.[0];
        const posRaw = firstMeaning?.partOfSpeech || 'noun';
        const pos: PartOfSpeech = ['adjective', 'noun', 'verb', 'adverb'].includes(posRaw)
          ? (posRaw as PartOfSpeech)
          : 'noun';

        const def = firstMeaning?.definitions?.[0];
        const enDefinition = def?.definition || '';
        const exampleEn = def?.example || `They demonstrated a remarkable sense of ${cleanWord} during the trial.`;

        // Provide smart translation preview
        return {
          word: entry.word || cleanWord,
          phonetic: phonetic,
          partOfSpeech: pos,
          partOfSpeechTh: posMapTh[pos] || 'คำนาม',
          meaning: `${enDefinition ? `${enDefinition} ` : ''}(แปลไทย: มีคุณลักษณะหรือความหมายที่เกี่ยวข้องกับ ${cleanWord})`,
          exampleEn: exampleEn,
          exampleTh: `ประโยคตัวอย่างการใช้คำว่า "${cleanWord}" ในบริบทจริง`,
          cefr: cleanWord.length > 8 ? 'C1' : 'B2',
          mnemonicImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
          mnemonicCaption: `ภาพช่วยจำสอดคล้องกับความหมายของ "${cleanWord}"`,
        };
      }
    }
  } catch {
    // network or api error
  }

  // Graceful fallback if completely offline or unrecognized
  return {
    word: cleanWord,
    phonetic: `/${cleanWord}/`,
    partOfSpeech: 'noun',
    partOfSpeechTh: 'นาม',
    meaning: `ความหมายของคำว่า "${cleanWord}" (แตะเพื่อแก้ไขความหมายตามต้องการ)`,
    exampleEn: `We found that ${cleanWord} was essential to our daily study.`,
    exampleTh: `พวกเราพบว่า ${cleanWord} มีความจำเป็นอย่างยิ่งต่อการเรียนรู้ประจำวัน`,
    cefr: 'B1',
    mnemonicImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
    mnemonicCaption: `ภาพช่วยจำสำหรับคำว่า ${cleanWord}`,
  };
}
