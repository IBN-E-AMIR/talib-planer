import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, MyBook } from '../store';
import { useT } from '../i18n';
import { PageTitle, Empty, ProgressBar } from '../components/ui';
import { CATALOG, SUBJECTS, addDays, todayStr, uid } from '../data';

export default function Dars() {
  const { t, lang } = useT();
  const { books, setBooks } = useApp();
  const nav = useNavigate();
  const [filter, setFilter] = useState('all');
  const [custom, setCustom] = useState({ title: '', subjectId: 'sarf', year: 1, total: 20 });
  const today = todayStr();
  const subName = (id: string) => { const s = SUBJECTS.find((x) => x.id === id); return s ? (lang === 'ur' ? s.ur : s.en) : id; };

  const addCatalog = (id: string) => {
    const c = CATALOG.find((x) => x.id === id);
    if (!c) return;
    const b: MyBook = { id: uid(), catalogId: c.id, subjectId: c.subjectId, title: c.en, titleUr: c.ur, year: c.year, total: c.lessons, done: 0, revision: addDays(today, 7) };
    setBooks((p) => [...p, b]);
  };
  const addCustom = () => {
    if (!custom.title.trim()) return;
    setBooks((p) => [...p, { id: uid(), subjectId: custom.subjectId, title: custom.title.trim(), year: custom.year, total: Math.max(1, custom.total), done: 0, revision: addDays(today, 7) }]);
    setCustom({ ...custom, title: '' });
  };
  const upd = (id: string, patch: Partial<MyBook>) => setBooks((p) => p.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const mine = books.filter((b) => filter === 'all' || b.subjectId === filter);
  const cat = CATALOG.filter((c) => filter === 'all' || c.subjectId === filter);

  return (
    <div className="space-y-6">
      <PageTitle title={t('dars')} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('subjects')}>
        <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('all')}>{t('allSubjects')}</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} className={`btn ${filter === s.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s.id)}>{lang === 'ur' ? s.ur : s.en.split(' ')[0]}</button>
        ))}
      </div>

      <section>
        <h2 className="mb-2 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('myBooks')}</h2>
        {mine.length === 0 ? <Empty icon="📖" text={t('noBooks')} /> : (
          <div className="grid gap-3 sm:grid-cols-2">
            {mine.map((b) => {
              const due = b.revision && b.revision <= today;
              return (
                <article key={b.id} className="card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-arabic text-xl font-bold">{lang === 'ur' && b.titleUr ? b.titleUr : b.title}</h3>
                      <p className="muted">{subName(b.subjectId)} · {t('darja')} {b.year}</p>
                    </div>
                    {due && <span className="rounded-full bg-gold px-2 py-1 text-xs font-bold text-emerald-dark">{t('revisionDue')}</span>}
                  </div>
                  <div className="my-3">
                    <ProgressBar value={b.done} max={b.total} label={b.title} />
                    <p className="muted mt-1">{t('lessonsDone')}: {b.done} / {b.total}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-ghost" onClick={() => upd(b.id, { done: Math.max(0, b.done - 1) })} aria-label="-1">−</button>
                    <button className="btn btn-primary" onClick={() => upd(b.id, { done: Math.min(b.total, b.done + 1) })} aria-label="+1">+ 1</button>
                    <button className="btn btn-gold" onClick={() => upd(b.id, { revision: addDays(today, 7) })}>{t('revisedToday')}</button>
                    <button className="btn btn-ghost" onClick={() => nav(`/notes?ref=dars&title=${encodeURIComponent(b.title)}`)}>📝</button>
                    <button className="btn btn-danger" onClick={() => setBooks((p) => p.filter((x) => x.id !== b.id))} aria-label={t('delete')}>🗑</button>
                  </div>
                  <p className="muted mt-2">{t('nextRevision')}: <span dir="ltr">{b.revision}</span></p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('catalog')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {cat.map((c) => {
            const added = books.some((b) => b.catalogId === c.id);
            return (
              <div key={c.id} className="card flex items-center justify-between gap-2">
                <div>
                  <div className="font-arabic text-lg font-bold">{lang === 'ur' ? c.ur : c.en}</div>
                  <div className="muted">{subName(c.subjectId)} · {t('darja')} {c.year} · {c.lessons} {t('lessons')}</div>
                </div>
                <button className={`btn ${added ? 'btn-ghost' : 'btn-primary'}`} disabled={added} onClick={() => addCatalog(c.id)}>{added ? t('alreadyAdded') : t('add')}</button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="mb-3 font-arabic text-xl font-bold text-emerald dark:text-gold-light">{t('customBook')}</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2"><label className="label" htmlFor="ct">{t('bookTitle')}</label><input id="ct" className="input" value={custom.title} onChange={(e) => setCustom({ ...custom, title: e.target.value })} /></div>
          <div><label className="label" htmlFor="cs">{t('subject')}</label>
            <select id="cs" className="input" value={custom.subjectId} onChange={(e) => setCustom({ ...custom, subjectId: e.target.value })}>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{lang === 'ur' ? s.ur : s.en}</option>)}
            </select></div>
          <div><label className="label" htmlFor="cy">{t('year')}</label><input id="cy" type="number" min={1} max={8} className="input" value={custom.year} onChange={(e) => setCustom({ ...custom, year: Number(e.target.value) })} /></div>
          <div><label className="label" htmlFor="cl">{t('totalLessons')}</label><input id="cl" type="number" min={1} className="input" value={custom.total} onChange={(e) => setCustom({ ...custom, total: Number(e.target.value) })} /></div>
          <div className="flex items-end"><button className="btn btn-primary w-full" onClick={addCustom}>{t('add')}</button></div>
        </div>
      </section>
    </div>
  );
}
