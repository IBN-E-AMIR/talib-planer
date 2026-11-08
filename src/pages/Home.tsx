import { Link } from 'react-router-dom';
import { useApp } from '../store';
import { useT } from '../i18n';
import { useNow, usePrayerTimes, nextPrayer, fmtCountdown, buildSlots } from '../hooks';
import { Ring } from '../components/ui';
import { todayStr } from '../data';

export default function Home() {
  const { t, lang } = useT();
  const { settings, books, courses, logs, assign, slotDone } = useApp();
  const now = useNow();
  const { timings } = usePrayerTimes();
  const today = todayStr();
  const next = timings ? nextPrayer(timings, now) : null;
  const slots = timings ? buildSlots(timings) : [];
  const doneCount = slots.filter((s) => slotDone[`${today}|${s.key}`]).length;
  const due = books.filter((b) => b.revision && b.revision <= today);
  const lessonsDone = books.reduce((a, b) => a + b.done, 0);
  const lessonsTotal = books.reduce((a, b) => a + b.total, 0);
  const itemsDone = courses.filter((c) => c.status === 'done').length;
  const todayMin = logs.filter((l) => l.date === today).reduce((a, l) => a + l.minutes, 0);
  const assignedCount = slots.filter((s) => assign[`${today}|${s.key}`]).length;

  return (
    <div className="space-y-5">
      <section className="card pattern text-center">
        <p className="font-arabic text-3xl text-emerald dark:text-gold-light" dir="rtl">{t('bismillah')}</p>
        <h1 className="h1 mt-2">{t('salam')}{settings.name ? `، ${settings.name}` : ''}</h1>
        <p className="muted mt-1">{t('tagline')}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card bg-gradient-to-br from-emerald to-emerald-dark text-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-gold-light">{t('nextPrayer')}</div>
          {next ? (
            <>
              <div className="font-arabic text-4xl font-bold">{t(next.name)}</div>
              <div className="mt-1 text-sm text-white/80">{t('in')} <span className="font-mono text-xl text-gold-light" dir="ltr">{fmtCountdown(next.secondsLeft)}</span></div>
            </>
          ) : (
            <Link to="/timetable" className="mt-2 inline-block text-gold-light underline">{t('loadingTimes')}</Link>
          )}
        </div>
        <div className="card">
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald dark:text-gold-light">{t('todaySummary')}</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li>🕌 {slots.length} {t('openSlots')} · {assignedCount} {t('planned').toLowerCase()}</li>
            <li>✅ {doneCount} {t('doneSlots')}</li>
            <li>⏱ {t('studiedToday')}: {todayMin} {t('min')}</li>
          </ul>
          <Link to="/timetable" className="btn btn-ghost mt-3">{t('timetable')}</Link>
        </div>
      </section>

      <section className="card">
        <div className="grid grid-cols-2 gap-4">
          <Ring value={lessonsDone} max={lessonsTotal} label={t('progressDars')} sub={`${lessonsDone}/${lessonsTotal} ${t('lessons')}`} />
          <Ring value={itemsDone} max={courses.length} label={t('progressEmb')} sub={`${itemsDone}/${courses.length}`} />
        </div>
      </section>

      <section className="card">
        <h2 className="mb-2 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('dueList')}</h2>
        {due.length === 0 ? <p className="muted">{t('nothingDue')}</p> : (
          <ul className="space-y-2">
            {due.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-xl bg-gold-soft px-3 py-2 text-sm text-emerald-dark">
                <span>📖 {lang === 'ur' && b.titleUr ? b.titleUr : b.title}</span>
                <Link to="/dars" className="font-semibold underline">{t('dars')}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
