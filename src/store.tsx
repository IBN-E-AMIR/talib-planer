import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Timings } from './data';

export interface Settings { name: string; city: string; country: string; lang: 'en' | 'ur'; theme: 'light' | 'dark' }
export interface MyBook { id: string; subjectId: string; catalogId?: string; title: string; titleUr?: string; year: number; total: number; done: number; revision: string }
export interface Course { id: string; title: string; type: 'course' | 'lab' | 'project'; status: 'planned' | 'doing' | 'done'; hours: number }
export interface Note { id: string; ref: 'dars' | 'embedded' | 'general'; title: string; content: string; created: string }
export interface Log { id: string; date: string; track: 'dars' | 'embedded'; minutes: number }
export interface PrayerCache { city: string; country: string; date: string; timings: Timings }

function useLS<T>(key: string, init: T): [T, Dispatch<SetStateAction<T>>] {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage full or blocked */ } }, [key, v]);
  return [v, setV];
}

interface AppState {
  settings: Settings; setSettings: Dispatch<SetStateAction<Settings>>;
  books: MyBook[]; setBooks: Dispatch<SetStateAction<MyBook[]>>;
  courses: Course[]; setCourses: Dispatch<SetStateAction<Course[]>>;
  notes: Note[]; setNotes: Dispatch<SetStateAction<Note[]>>;
  logs: Log[]; setLogs: Dispatch<SetStateAction<Log[]>>;
  assign: Record<string, string>; setAssign: Dispatch<SetStateAction<Record<string, string>>>;
  slotDone: Record<string, boolean>; setSlotDone: Dispatch<SetStateAction<Record<string, boolean>>>;
  prayerCache: PrayerCache | null; setPrayerCache: Dispatch<SetStateAction<PrayerCache | null>>;
  resetAll: () => void;
}

const Ctx = createContext<AppState | null>(null);
const PREFIX = 'talib.';

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLS<Settings>(PREFIX + 'settings', { name: '', city: 'Lahore', country: 'Pakistan', lang: 'en', theme: 'light' });
  const [books, setBooks] = useLS<MyBook[]>(PREFIX + 'books', []);
  const [courses, setCourses] = useLS<Course[]>(PREFIX + 'courses', []);
  const [notes, setNotes] = useLS<Note[]>(PREFIX + 'notes', []);
  const [logs, setLogs] = useLS<Log[]>(PREFIX + 'logs', []);
  const [assign, setAssign] = useLS<Record<string, string>>(PREFIX + 'assign', {});
  const [slotDone, setSlotDone] = useLS<Record<string, boolean>>(PREFIX + 'slotDone', {});
  const [prayerCache, setPrayerCache] = useLS<PrayerCache | null>(PREFIX + 'prayerCache', null);
  const resetAll = () => {
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };
  return (
    <Ctx.Provider value={{ settings, setSettings, books, setBooks, courses, setCourses, notes, setNotes, logs, setLogs, assign, setAssign, slotDone, setSlotDone, prayerCache, setPrayerCache, resetAll }}>
      {children}
    </Ctx.Provider>
  );
}
export function useApp(): AppState {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
}
