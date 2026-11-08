import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useApp } from './store';

type Dict = Record<string, string>;

const en: Dict = {
  appName: 'Talib Planner', tagline: 'Plan your day around prayer. Grow in Dars-e-Nizami and Embedded Systems.',
  bismillah: 'بسم اللہ الرحمن الرحیم',
  home: 'Home', timetable: 'Timetable', dars: 'Dars-e-Nizami', embedded: 'Embedded', notes: 'Notes', progress: 'Progress', settings: 'Settings',
  salam: 'Assalamu Alaikum', welcome: 'Welcome to your study planner.',
  nextPrayer: 'Next prayer', in: 'in', today: 'Today', city: 'City', country: 'Country', name: 'Your name',
  language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', save: 'Save', add: 'Add', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', search: 'Search',
  prayerTimes: 'Prayer Times', loadingTimes: 'Loading prayer times…', savedTimes: 'Showing saved times (offline or service unavailable).',
  retry: 'Refresh', fetchError: 'Could not get prayer times. Check the city and country.',
  Fajr: 'Fajr', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha',
  dailyTimetable: 'Daily Timetable', studySlot: 'Study slot', free: 'Free', prayerBlock: 'Prayer', assign: 'Assign activity',
  act_: 'Not assigned', act_dars: 'Dars-e-Nizami', act_embedded: 'Embedded Systems', act_revision: 'Revision', act_rest: 'Rest',
  markDone: 'Mark done', done: 'Done', undo: 'Undo', slotsTip: 'Gaps between prayers are your study slots. Assign each slot, then mark it done to add it to your progress.',
  noSlots: 'No free study slots today.',
  subjects: 'Subjects', allSubjects: 'All subjects', myBooks: 'My Books', catalog: 'Book Catalog', darja: 'Darja', lessons: 'lessons', lessonsDone: 'Lessons done',
  addToMine: 'Add to My Books', alreadyAdded: 'Added', customBook: 'Add your own book', bookTitle: 'Book title', totalLessons: 'Total lessons', subject: 'Subject', year: 'Year (Darja)',
  revisionDue: 'Revision due', revisedToday: 'Revised today', nextRevision: 'Next revision', noBooks: 'No books yet. Add one from the catalog below.',
  courses: 'Courses', labs: 'Labs', projects: 'Mini-projects', allTypes: 'All', planned: 'Planned', doing: 'In progress', doneStatus: 'Done',
  itemTitle: 'Title', type: 'Type', course: 'Course', lab: 'Lab', project: 'Mini-project', hours: 'Hours', noItems: 'Nothing here yet. Add your first item.',
  addItem: 'Add item', moveLeft: 'Move back', moveRight: 'Move forward',
  newNote: 'New note', noteTitle: 'Note title', noteContent: 'Write your note or code here…', all: 'All', general: 'General', noNotes: 'No notes yet. Write your first note.',
  weeklyProgress: 'Weekly Progress', totalHours: 'Hours this week', streak: 'Day streak', days: 'days', logStudy: 'Log study time', minutes: 'Minutes', track: 'Track', log: 'Log',
  booksFinished: 'Books finished', itemsDone: 'Items done', minutesPerDay: 'Study minutes per day', noLogs: 'No study logged yet this week.',
  todaySummary: 'Today at a glance', openSlots: 'study slots', doneSlots: 'done', dueList: 'Revision due', nothingDue: 'Nothing due. Masha Allah!',
  progressDars: 'Dars-e-Nizami', progressEmb: 'Embedded Systems', studiedToday: 'Studied today',
  exportData: 'Export my data', resetData: 'Reset all data', confirmReset: 'Delete all saved data on this device?', dataNote: 'Your data is saved in this browser only. Use Export to keep a copy.',
  getStarted: 'Get Started', f1: 'Prayer-aware timetable', f1d: 'Study slots appear automatically between the five prayers.',
  f2: 'Dars-e-Nizami tracker', f2d: 'Follow each book, lesson and revision date.',
  f3: 'Embedded systems tracker', f3d: 'Courses, labs and mini-projects on one simple board.',
  footerDua: 'Our Lord, increase us in knowledge.', min: 'min',
};

const ur: Dict = {
  appName: 'طالب پلانر', tagline: 'نماز کے اوقات کے مطابق دن کی منصوبہ بندی کریں۔ درس نظامی اور ایمبیڈڈ سسٹمز میں آگے بڑھیں۔',
  bismillah: 'بسم اللہ الرحمن الرحیم',
  home: 'ہوم', timetable: 'ٹائم ٹیبل', dars: 'درس نظامی', embedded: 'ایمبیڈڈ', notes: 'نوٹس', progress: 'پیش رفت', settings: 'سیٹنگز',
  salam: 'السلام علیکم', welcome: 'آپ کے مطالعہ پلانر میں خوش آمدید۔',
  nextPrayer: 'اگلی نماز', in: 'میں', today: 'آج', city: 'شہر', country: 'ملک', name: 'آپ کا نام',
  language: 'زبان', theme: 'تھیم', light: 'روشن', dark: 'تاریک', save: 'محفوظ کریں', add: 'شامل کریں', cancel: 'منسوخ', delete: 'حذف', edit: 'ترمیم', search: 'تلاش',
  prayerTimes: 'نماز کے اوقات', loadingTimes: 'نماز کے اوقات لوڈ ہو رہے ہیں…', savedTimes: 'محفوظ شدہ اوقات دکھائے جا رہے ہیں (آف لائن یا سروس دستیاب نہیں)۔',
  retry: 'تازہ کریں', fetchError: 'نماز کے اوقات نہیں مل سکے۔ شہر اور ملک چیک کریں۔',
  Fajr: 'فجر', Dhuhr: 'ظہر', Asr: 'عصر', Maghrib: 'مغرب', Isha: 'عشاء',
  dailyTimetable: 'روزانہ ٹائم ٹیبل', studySlot: 'مطالعہ کا وقت', free: 'خالی', prayerBlock: 'نماز', assign: 'سرگرمی مقرر کریں',
  act_: 'مقرر نہیں', act_dars: 'درس نظامی', act_embedded: 'ایمبیڈڈ سسٹمز', act_revision: 'دہرائی', act_rest: 'آرام',
  markDone: 'مکمل کریں', done: 'مکمل', undo: 'واپس', slotsTip: 'نمازوں کے درمیان کا وقت آپ کا مطالعہ کا وقت ہے۔ ہر وقت مقرر کریں، پھر مکمل کریں تاکہ پیش رفت میں شامل ہو۔',
  noSlots: 'آج مطالعہ کے لیے خالی وقت نہیں۔',
  subjects: 'مضامین', allSubjects: 'تمام مضامین', myBooks: 'میری کتابیں', catalog: 'کتابوں کی فہرست', darja: 'درجہ', lessons: 'اسباق', lessonsDone: 'مکمل اسباق',
  addToMine: 'میری کتابوں میں شامل کریں', alreadyAdded: 'شامل ہے', customBook: 'اپنی کتاب شامل کریں', bookTitle: 'کتاب کا نام', totalLessons: 'کل اسباق', subject: 'مضمون', year: 'سال (درجہ)',
  revisionDue: 'دہرائی باقی', revisedToday: 'آج دہرائی کی', nextRevision: 'اگلی دہرائی', noBooks: 'ابھی کوئی کتاب نہیں۔ نیچے فہرست سے شامل کریں۔',
  courses: 'کورسز', labs: 'لیبز', projects: 'چھوٹے پروجیکٹس', allTypes: 'تمام', planned: 'منصوبہ', doing: 'جاری', doneStatus: 'مکمل',
  itemTitle: 'عنوان', type: 'قسم', course: 'کورس', lab: 'لیب', project: 'چھوٹا پروجیکٹ', hours: 'گھنٹے', noItems: 'ابھی کچھ نہیں۔ پہلی چیز شامل کریں۔',
  addItem: 'شامل کریں', moveLeft: 'پیچھے', moveRight: 'آگے',
  newNote: 'نیا نوٹ', noteTitle: 'نوٹ کا عنوان', noteContent: 'اپنا نوٹ یا کوڈ یہاں لکھیں…', all: 'تمام', general: 'عمومی', noNotes: 'ابھی کوئی نوٹ نہیں۔ پہلا نوٹ لکھیں۔',
  weeklyProgress: 'ہفتہ وار پیش رفت', totalHours: 'اس ہفتے کے گھنٹے', streak: 'مسلسل دن', days: 'دن', logStudy: 'مطالعہ کا وقت درج کریں', minutes: 'منٹ', track: 'شعبہ', log: 'درج کریں',
  booksFinished: 'مکمل کتابیں', itemsDone: 'مکمل کام', minutesPerDay: 'روزانہ مطالعہ (منٹ)', noLogs: 'اس ہفتے ابھی کوئی مطالعہ درج نہیں۔',
  todaySummary: 'آج کا خلاصہ', openSlots: 'مطالعہ کے اوقات', doneSlots: 'مکمل', dueList: 'دہرائی باقی', nothingDue: 'کچھ باقی نہیں۔ ماشاءاللہ!',
  progressDars: 'درس نظامی', progressEmb: 'ایمبیڈڈ سسٹمز', studiedToday: 'آج کا مطالعہ',
  exportData: 'میرا ڈیٹا ایکسپورٹ کریں', resetData: 'تمام ڈیٹا مٹائیں', confirmReset: 'اس ڈیوائس پر محفوظ تمام ڈیٹا حذف کریں؟', dataNote: 'آپ کا ڈیٹا صرف اسی براؤزر میں محفوظ ہے۔ کاپی رکھنے کے لیے ایکسپورٹ کریں۔',
  getStarted: 'شروع کریں', f1: 'نماز کے مطابق ٹائم ٹیبل', f1d: 'پانچ نمازوں کے درمیان مطالعہ کے اوقات خود بخود بنتے ہیں۔',
  f2: 'درس نظامی ٹریکر', f2d: 'ہر کتاب، سبق اور دہرائی کی تاریخ دیکھیں۔',
  f3: 'ایمبیڈڈ سسٹمز ٹریکر', f3d: 'کورسز، لیبز اور چھوٹے پروجیکٹس ایک سادہ بورڈ پر۔',
  footerDua: 'اے ہمارے رب! ہمارے علم میں اضافہ فرما۔', min: 'منٹ',
};

const DICTS: Record<string, Dict> = { en, ur };
type Ctx = { t: (k: string) => string; lang: 'en' | 'ur'; rtl: boolean };
const I18nCtx = createContext<Ctx>({ t: (k) => k, lang: 'en', rtl: false });

export function I18nProvider({ children }: { children: ReactNode }) {
  const { settings } = useApp();
  const lang = settings.lang;
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    document.title = DICTS[lang].appName;
  }, [lang, settings.theme]);
  const t = (k: string) => DICTS[lang][k] ?? en[k] ?? k;
  return <I18nCtx.Provider value={{ t, lang, rtl: lang === 'ur' }}>{children}</I18nCtx.Provider>;
}
export const useT = () => useContext(I18nCtx);
