import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp, Note } from '../store';
import { useT } from '../i18n';
import { PageTitle, Empty } from '../components/ui';
import { todayStr, uid } from '../data';

type Draft = { id: string | null; ref: Note['ref']; title: string; content: string };
const blank: Draft = { id: null, ref: 'general', title: '', content: '' };

export default function Notes() {
  const { t } = useT();
  const { notes, setNotes } = useApp();
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | Note['ref']>('all');

  useEffect(() => {
    const ref = params.get('ref');
    if (ref === 'dars' || ref === 'embedded') {
      setDraft({ ...blank, ref, title: params.get('title') ?? '' });
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const save = () => {
    if (!draft || (!draft.title.trim() && !draft.content.trim())) return;
    if (draft.id) setNotes((p) => p.map((n) => (n.id === draft.id ? { ...n, ref: draft.ref, title: draft.title, content: draft.content } : n)));
    else setNotes((p) => [{ id: uid(), ref: draft.ref, title: draft.title.trim() || '—', content: draft.content, created: todayStr() }, ...p]);
    setDraft(null);
  };

  const shown = notes.filter((n) => (filter === 'all' || n.ref === filter) && (n.title + ' ' + n.content).toLowerCase().includes(q.toLowerCase()));
  const REFS: { id: Note['ref']; key: string }[] = [{ id: 'dars', key: 'dars' }, { id: 'embedded', key: 'embedded' }, { id: 'general', key: 'general' }];

  return (
    <div className="space-y-5">
      <PageTitle title={t('notes')} />
      <div className="flex flex-wrap items-center gap-2">
        <input className="input sm:max-w-xs" placeholder={t('search')} aria-label={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
        {(['all', 'dars', 'embedded', 'general'] as const).map((f) => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>{t(f === 'all' ? 'all' : f)}</button>
        ))}
        <button className="btn btn-gold ms-auto" onClick={() => setDraft(blank)}>＋ {t('newNote')}</button>
      </div>

      {draft && (
        <section className="card space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2"><label className="label" htmlFor="nt">{t('noteTitle')}</label><input id="nt" className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div><label className="label" htmlFor="nr">{t('type')}</label>
              <select id="nr" className="input" value={draft.ref} onChange={(e) => setDraft({ ...draft, ref: e.target.value as Note['ref'] })}>
                {REFS.map((r) => <option key={r.id} value={r.id}>{t(r.key)}</option>)}
              </select></div>
          </div>
          <textarea className="input min-h-[160px] font-mono" dir="auto" placeholder={t('noteContent')} aria-label={t('noteContent')} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          <div className="flex gap-2"><button className="btn btn-primary" onClick={save}>{t('save')}</button><button className="btn btn-ghost" onClick={() => setDraft(null)}>{t('cancel')}</button></div>
        </section>
      )}

      {shown.length === 0 && !draft ? <Empty icon="📝" text={t('noNotes')}><button className="btn btn-primary" onClick={() => setDraft(blank)}>{t('newNote')}</button></Empty> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {shown.map((n) => (
            <article key={n.id} className="card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-arabic text-lg font-bold">{n.title}</h3>
                <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-xs text-emerald">{t(n.ref)}</span>
              </div>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-sm" dir="auto">{n.content}</pre>
              <div className="mt-3 flex items-center gap-2">
                <span className="muted" dir="ltr">{n.created}</span>
                <button className="btn btn-ghost ms-auto !min-h-[36px]" onClick={() => setDraft({ id: n.id, ref: n.ref, title: n.title, content: n.content })}>{t('edit')}</button>
                <button className="btn btn-danger !min-h-[36px]" onClick={() => setNotes((p) => p.filter((x) => x.id !== n.id))} aria-label={t('delete')}>🗑</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
