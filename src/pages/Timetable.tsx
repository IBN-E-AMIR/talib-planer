import { useApp } from '../store';
import { useT } from '../i18n';
import { useNow, usePrayerTimes, nextPrayer, fmtCountdown, buildSlots, PRAYER_BLOCK_MIN } from '../hooks';
import { PageTitle, Empty } from '../components/ui';
import { ACTIVITIES, PRAYERS, fmtMin, toMin, todayStr } from '../data';

export default function Timetable() {
  const { t } = useT();
  const { settings, assign, setAssign, slotDone, setSlotDone, setLogs } = useApp();
  const now = useNow();
  const { timings, status, refresh } = usePrayerTimes();
  const today = todayStr();

  if (!timings) {
    return (
      <div>
        <PageTitle title={t('timetable')} />
        <Empty icon="🕌" text={status === 'loading' ? t('loadingTimes') : t('fetchError')}>
          <button className="btn btn-primary" onClick={refresh}>{t('retry')}</button>
        </Empty>
      </div>
    );
  }

  const next = nextPrayer(timings, now);
  const slots = buildSlots(timings);
  // merge prayer blocks and slots into one timeline
  type Row = { kind: 'prayer'; name: (typeof PRAYERS)[number]; start: number } | { kind: 'slot'; slot: (typeof slots)[number] };
  const rows: Row[] = [
    ...PRAYERS.map((p) => ({ kind: 'prayer' as const, name: p, start: toMin(timings[p]) })),
    ...slots.map((s) => ({ kind: 'slot' as const, slot: s })),
  ].sort((a, b) => (a.kind === 'prayer' ? a.start : a.slot.start) - (b.kind === 'prayer' ? b.start : b.slot.start));

  const setAct = (key: string, v: string) => setAssign((p) => ({ ...p, [`${today}|${key}`]: v }));
  const toggleDone = (key: string, minutes: number) => {
    const k = `${today}|${key}`;
    const act = assign[k];
    const isDone = !!slotDone[k];
    setSlotDone((p) => ({ ...p, [k]: !isDone }));
    const logId = `slot-${k}`;
    if (isDone) setLogs((p) => p.filter((l) => l.id !== logId));
    else if (act === 'dars' || act === 'embedded') setLogs((p) => [...p.filter((l) => l.id !== logId), { id: logId, date: today, track: act, minutes }]);
  };

  return (
    <div>
      <PageTitle title={t('timetable')} subtitle={`${settings.city}, ${settings.country}`} />
      {status === 'saved' && <p className="mb-3 rounded-xl bg-gold-soft px-3 py-2 text-sm text-emerald-dark">⚠️ {t('savedTimes')}</p>}

      <h2 className="mb-2 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('prayerTimes')}</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {PRAYERS.map((p) => (
          <div key={p} className={`card text-center ${next.name === p ? 'ring-2 ring-gold' : ''}`}>
            <div className="font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t(p)}</div>
            <div className="font-mono text-lg" dir="ltr">{fmtMin(toMin(timings[p]))}</div>
            {next.name === p && <div className="mt-1 text-xs font-semibold text-gold" dir="ltr">{fmtCountdown(next.secondsLeft)}</div>}
          </div>
        ))}
      </div>

      <h2 className="mb-1 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('dailyTimetable')}</h2>
      <p className="muted mb-3">{t('slotsTip')}</p>
      {slots.length === 0 && <Empty icon="🌙" text={t('noSlots')} />}
      <ol className="space-y-3 border-s-2 border-gold/50 ps-4">
        {rows.map((r) => {
          if (r.kind === 'prayer') {
            return (
              <li key={r.name} className="relative rounded-xl bg-emerald p-3 text-white">
                <span className="absolute -start-[25px] top-4 h-3 w-3 rounded-full bg-gold" aria-hidden />
                <div className="flex items-center justify-between">
                  <span className="font-arabic text-lg font-bold">🕌 {t(r.name)}</span>
                  <span className="font-mono text-sm text-gold-light" dir="ltr">{fmtMin(r.start)} – {fmtMin(r.start + PRAYER_BLOCK_MIN)}</span>
                </div>
              </li>
            );
          }
          const s = r.slot;
          const k = `${today}|${s.key}`;
          const act = assign[k] ?? '';
          const isDone = !!slotDone[k];
          return (
            <li key={s.key} className={`card relative ${isDone ? 'opacity-70' : ''}`}>
              <span className="absolute -start-[25px] top-6 h-3 w-3 rounded-full border-2 border-gold bg-cream" aria-hidden />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">{t('studySlot')} · {t('free')} {Math.floor(s.minutes / 60)}h {s.minutes % 60}m</div>
                  <div className="font-mono text-sm text-slate-500" dir="ltr">{fmtMin(s.start)} – {fmtMin(s.end)}</div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <select className="input sm:w-52" value={act} onChange={(e) => setAct(s.key, e.target.value)} aria-label={t('assign')}>
                    {ACTIVITIES.map((a) => <option key={a} value={a}>{t('act_' + a)}</option>)}
                  </select>
                  {act && (
                    <button className={`btn ${isDone ? 'btn-ghost' : 'btn-gold'}`} onClick={() => toggleDone(s.key, s.minutes)}>
                      {isDone ? `↩ ${t('undo')}` : `✓ ${t('markDone')}`}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
