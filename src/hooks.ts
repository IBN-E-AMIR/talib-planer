import { useCallback, useEffect, useState } from 'react';
import { useApp } from './store';
import { PRAYERS, Timings, todayStr, toMin } from './data';

export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), intervalMs); return () => clearInterval(id); }, [intervalMs]);
  return now;
}

export type PrayerStatus = 'loading' | 'ok' | 'saved' | 'error';

export function usePrayerTimes() {
  const { settings, prayerCache, setPrayerCache } = useApp();
  const [status, setStatus] = useState<PrayerStatus>('loading');
  const { city, country } = settings;

  const load = useCallback(async (force: boolean) => {
    const date = todayStr();
    if (!force && prayerCache && prayerCache.city === city && prayerCache.country === country && prayerCache.date === date) {
      setStatus('ok');
      return;
    }
    setStatus('loading');
    try {
      // method=1: University of Islamic Sciences, Karachi. school=1: Hanafi Asr.
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=1&school=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('bad response');
      const json = await res.json();
      const raw = json?.data?.timings;
      if (!raw) throw new Error('no timings');
      const timings = {} as Timings;
      PRAYERS.forEach((p) => { timings[p] = String(raw[p]).slice(0, 5); });
      setPrayerCache({ city, country, date, timings });
      setStatus('ok');
    } catch {
      setStatus(prayerCache && prayerCache.city === city && prayerCache.country === country ? 'saved' : 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, country, prayerCache?.date, prayerCache?.city, prayerCache?.country]);

  useEffect(() => { void load(false); }, [load]);

  const timings = prayerCache && prayerCache.city === city && prayerCache.country === country ? prayerCache.timings : null;
  return { timings, status, refresh: () => load(true) };
}

export function nextPrayer(timings: Timings, now: Date): { name: (typeof PRAYERS)[number]; secondsLeft: number } {
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  for (const p of PRAYERS) {
    const s = toMin(timings[p]) * 60;
    if (s > nowSec) return { name: p, secondsLeft: s - nowSec };
  }
  return { name: 'Fajr', secondsLeft: 24 * 3600 - nowSec + toMin(timings.Fajr) * 60 };
}

export function fmtCountdown(sec: number): string {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export interface Slot { key: string; start: number; end: number; minutes: number }
const PRAYER_LEN = 20;

export function buildSlots(timings: Timings): Slot[] {
  const starts = PRAYERS.map((p) => toMin(timings[p]));
  const bounds: [number, number][] = [];
  for (let i = 0; i < 4; i++) bounds.push([starts[i] + PRAYER_LEN, starts[i + 1]]);
  bounds.push([starts[4] + PRAYER_LEN, 23 * 60]);
  return bounds
    .filter(([a, b]) => b - a >= 30)
    .map(([a, b]) => ({ key: `${a}`, start: a, end: b, minutes: b - a }));
}
export const PRAYER_BLOCK_MIN = PRAYER_LEN;
