import { useState } from 'react';
import { useApp, Course } from '../store';
import { useT } from '../i18n';
import { PageTitle, Empty } from '../components/ui';
import { uid } from '../data';

const STATUSES: Course['status'][] = ['planned', 'doing', 'done'];
const STATUS_KEY: Record<Course['status'], string> = { planned: 'planned', doing: 'doing', done: 'doneStatus' };

export default function Embedded() {
  const { t } = useT();
  const { courses, setCourses } = useApp();
  const [tab, setTab] = useState<'all' | Course['type']>('all');
  const [form, setForm] = useState<{ title: string; type: Course['type'] }>({ title: '', type: 'course' });
  const list = courses.filter((c) => tab === 'all' || c.type === tab);

  const add = () => {
    if (!form.title.trim()) return;
    setCourses((p) => [...p, { id: uid(), title: form.title.trim(), type: form.type, status: 'planned', hours: 0 }]);
    setForm({ ...form, title: '' });
  };
  const upd = (id: string, patch: Partial<Course>) => setCourses((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const move = (c: Course, dir: 1 | -1) => {
    const i = STATUSES.indexOf(c.status) + dir;
    if (i >= 0 && i < STATUSES.length) upd(c.id, { status: STATUSES[i] });
  };
  const TABS: { id: 'all' | Course['type']; key: string }[] = [
    { id: 'all', key: 'allTypes' }, { id: 'course', key: 'courses' }, { id: 'lab', key: 'labs' }, { id: 'project', key: 'projects' },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title={t('embedded')} />
      <div className="flex flex-wrap gap-2">
        {TABS.map((x) => <button key={x.id} className={`btn ${tab === x.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(x.id)}>{t(x.key)}</button>)}
      </div>

      <section className="card">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2"><label className="label" htmlFor="et">{t('itemTitle')}</label><input id="et" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Arduino LED blink / ESP32 MQTT…" /></div>
          <div><label className="label" htmlFor="ety">{t('type')}</label>
            <select id="ety" className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Course['type'] })}>
              <option value="course">{t('course')}</option><option value="lab">{t('lab')}</option><option value="project">{t('project')}</option>
            </select></div>
          <div className="flex items-end"><button className="btn btn-primary w-full" onClick={add}>{t('addItem')}</button></div>
        </div>
      </section>

      {courses.length === 0 ? <Empty icon="🔌" text={t('noItems')} /> : (
        <div className="grid gap-4 md:grid-cols-3">
          {STATUSES.map((s) => (
            <section key={s} className="rounded-2xl bg-emerald/5 p-3 ring-1 ring-gold/30">
              <h2 className="mb-2 flex items-center justify-between font-arabic text-lg font-bold text-emerald dark:text-gold-light">
                {t(STATUS_KEY[s])}<span className="rounded-full bg-gold px-2 text-sm text-emerald-dark">{list.filter((c) => c.status === s).length}</span>
              </h2>
              <div className="space-y-2">
                {list.filter((c) => c.status === s).map((c) => (
                  <article key={c.id} className="card !p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{c.title}</h3>
                      <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-xs text-emerald">{t(c.type)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span>⏱ {c.hours} {t('hours')}</span>
                      <button className="btn btn-ghost !min-h-[36px] px-2" onClick={() => upd(c.id, { hours: c.hours + 1 })} aria-label="+1 hour">+1h</button>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button className="btn btn-ghost !min-h-[36px] flex-1" disabled={s === 'planned'} onClick={() => move(c, -1)} aria-label={t('moveLeft')}>◀</button>
                      <button className="btn btn-ghost !min-h-[36px] flex-1" disabled={s === 'done'} onClick={() => move(c, 1)} aria-label={t('moveRight')}>▶</button>
                      <button className="btn btn-danger !min-h-[36px]" onClick={() => setCourses((p) => p.filter((x) => x.id !== c.id))} aria-label={t('delete')}>🗑</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
