import { useState } from 'react';
import { useApp } from '../store';
import { useT } from '../i18n';
import { PageTitle } from '../components/ui';
import { addDays, todayStr, uid } from '../data';

export default function Progress() {
  const { t, lang } = useT();
  const { logs, setLogs, books, courses } = useApp();
  const [minutes, setMinutes] = useState(30);
  const [track, setTrack] = useState<'dars' | 'embedded'>('dars');
  const today = todayStr();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const perDay = days.map((d) => ({
    d,
    dars: logs.filter((l) => l.date === d && l.track === 'dars').reduce((a, l) => a + l.minutes, 0),
    emb: logs.filter((l) => l.date === d && l.track === 'embedded').reduce((a, l) => a + l.minutes, 0),
  }));
  const max = Math.max(60, ...perDay.map((p) => p.dars + p.emb));
  const weekMin = perDay.reduce((a, p) => a + p.dars + p.emb, 0);
  const hasLogs = weekMin > 0;

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = addDays(today, -i);
    if (logs.some((l) => l.date === d && l.minutes > 0)) streak++;
    else if (i === 0) continue; // today may not be studied yet
    else break;
  }
  const booksDone = books.filter((b) => b.total > 0 && b.done >= b.total).length;
  const itemsDone = courses.filter((c) => c.status === 'done').length;
  const dayLabel = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', { weekday: 'short' });

  return (
    <div className="space-y-5">
      <PageTitle title={t('weeklyProgress')} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [t('totalHours'), (weekMin / 60).toFixed(1)],
          [t('streak'), `${streak} ${t('days')}`],
          [t('booksFinished'), String(booksDone)],
          [t('itemsDone'), String(itemsDone)],
        ].map(([k, v]) => (
          <div key={k} className="card text-center"><div className="text-2xl font-bold text-emerald dark:text-gold-light">{v}</div><div className="muted">{k}</div></div>
        ))}
      </div>

      <section className="card">
        <h2 className="mb-3 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('minutesPerDay')}</h2>
        <div className="mb-2 flex gap-4 text-sm"><span><span className="me-1 inline-block h-3 w-3 rounded bg-emerald" />{t('progressDars')}</span><span><span className="me-1 inline-block h-3 w-3 rounded bg-gold" />{t('progressEmb')}</span></div>
        <div className="flex h-48 items-end gap-2" role="img" aria-label={t('minutesPerDay')}>
          {perDay.map((p) => (
            <div key={p.d} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="text-xs text-slate-500">{p.dars + p.emb || ''}</div>
              <div className="flex w-full flex-col justify-end overflow-hidden rounded-t-lg" style={{ height: `${((p.dars + p.emb) / max) * 100}%` }}>
                <div className="bg-gold" style={{ flex: p.emb }} />
                <div className="bg-emerald" style={{ flex: p.dars }} />
              </div>
              <div className="text-xs font-semibold">{dayLabel(p.d)}</div>
            </div>
          ))}
        </div>
        {!hasLogs && <p className="muted mt-3">{t('noLogs')}</p>}
      </section>

      <section className="card">
        <h2 className="mb-3 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('logStudy')}</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <div><label className="label" htmlFor="lt">{t('track')}</label>
            <select id="lt" className="input" value={track} onChange={(e) => setTrack(e.target.value as 'dars' | 'embedded')}>
              <option value="dars">{t('progressDars')}</option><option value="embedded">{t('progressEmb')}</option>
            </select></div>
          <div><label className="label" htmlFor="lm">{t('minutes')}</label><input id="lm" type="number" min={5} step={5} className="input" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} /></div>
          <div className="flex items-end sm:col-span-2"><button className="btn btn-primary w-full sm:w-auto" onClick={() => minutes > 0 && setLogs((p) => [...p, { id: uid(), date: today, track, minutes }])}>{t('log')}</button></div>
        </div>
      </section>
    </div>
  );
}
