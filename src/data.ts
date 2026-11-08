export interface Subject { id: string; en: string; ur: string }
export interface CatalogBook { id: string; subjectId: string; en: string; ur: string; year: number; lessons: number }

export const SUBJECTS: Subject[] = [
  { id: 'sarf', en: 'Sarf (Morphology)', ur: 'صرف' },
  { id: 'nahw', en: 'Nahw (Grammar)', ur: 'نحو' },
  { id: 'mantiq', en: 'Mantiq (Logic)', ur: 'منطق' },
  { id: 'balagha', en: 'Balagha (Rhetoric)', ur: 'بلاغت' },
  { id: 'fiqh', en: 'Fiqh (Jurisprudence)', ur: 'فقہ' },
  { id: 'usul', en: 'Usul al-Fiqh', ur: 'اصولِ فقہ' },
  { id: 'tafsir', en: 'Tafsir (Quran Commentary)', ur: 'تفسیر' },
  { id: 'hadith', en: 'Hadith', ur: 'حدیث' },
  { id: 'aqaid', en: 'Aqaid (Creed)', ur: 'عقائد' },
];

export const CATALOG: CatalogBook[] = [
  { id: 'mizan', subjectId: 'sarf', en: 'Mizan as-Sarf', ur: 'میزان الصرف', year: 1, lessons: 30 },
  { id: 'panjganj', subjectId: 'sarf', en: 'Panj Ganj', ur: 'پنج گنج', year: 1, lessons: 25 },
  { id: 'nahwmir', subjectId: 'nahw', en: 'Nahw Mir', ur: 'نحو میر', year: 2, lessons: 40 },
  { id: 'jami', subjectId: 'nahw', en: 'Sharh Jami', ur: 'شرح جامی', year: 4, lessons: 60 },
  { id: 'isagoji', subjectId: 'mantiq', en: 'Isagoji', ur: 'ایساغوجی', year: 3, lessons: 15 },
  { id: 'tahdhib', subjectId: 'mantiq', en: 'Sharh Tahdhib', ur: 'شرح تہذیب', year: 4, lessons: 30 },
  { id: 'talkhis', subjectId: 'balagha', en: 'Talkhis al-Miftah', ur: 'تلخیص المفتاح', year: 6, lessons: 40 },
  { id: 'nuridah', subjectId: 'fiqh', en: 'Nur al-Idah', ur: 'نور الایضاح', year: 3, lessons: 35 },
  { id: 'kanz', subjectId: 'fiqh', en: 'Kanz ad-Daqaiq', ur: 'کنز الدقائق', year: 4, lessons: 80 },
  { id: 'hidaya', subjectId: 'fiqh', en: 'Al-Hidaya', ur: 'ہدایہ', year: 6, lessons: 120 },
  { id: 'shashi', subjectId: 'usul', en: 'Usul ash-Shashi', ur: 'اصول الشاشی', year: 5, lessons: 30 },
  { id: 'jalalayn', subjectId: 'tafsir', en: 'Tafsir al-Jalalayn', ur: 'تفسیر جلالین', year: 7, lessons: 100 },
  { id: 'mishkat', subjectId: 'hadith', en: 'Mishkat al-Masabih', ur: 'مشکوٰۃ المصابیح', year: 7, lessons: 100 },
  { id: 'nasafi', subjectId: 'aqaid', en: 'Sharh Aqaid an-Nasafi', ur: 'شرح عقائد نسفی', year: 6, lessons: 25 },
];

export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = (typeof PRAYERS)[number];
export type Timings = Record<PrayerName, string>;

export const ACTIVITIES = ['', 'dars', 'embedded', 'revision', 'rest'] as const;

export const DUAS = [
  { ar: 'رَبِّ زِدْنِي عِلْمًا', en: 'My Lord, increase me in knowledge.', ur: 'اے میرے رب! میرے علم میں اضافہ فرما۔' },
  { ar: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي', en: 'O Allah, benefit me with what You have taught me.', ur: 'اے اللہ! جو تو نے مجھے سکھایا اس سے مجھے نفع دے۔' },
  { ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', en: 'My Lord, expand my chest and ease my task for me.', ur: 'اے میرے رب! میرا سینہ کھول دے اور میرا کام آسان کر دے۔' },
];

export const toMin = (hhmm: string): number => {
  const m = /(\d{1,2}):(\d{2})/.exec(hhmm);
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
};
export const fmtMin = (min: number): string => {
  const h = Math.floor(min / 60) % 24, m = min % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
};
export const todayStr = (d = new Date()): string => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
export const addDays = (date: string, n: number): string => {
  const [y, m, d] = date.split('-').map(Number);
  return todayStr(new Date(y, m - 1, d + n));
};
export const uid = (): string => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
