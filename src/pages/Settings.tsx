import { useApp } from '../store';
import { useT } from '../i18n';
import { PageTitle } from '../components/ui';

export default function Settings() {
  const { t } = useT();
  const app = useApp();
  const { settings, setSettings } = app;
  const set = (patch: Partial<typeof settings>) => setSettings({ ...settings, ...patch });
  const exportData = () => {
    const data = { settings: app.settings, books: app.books, courses: app.courses, notes: app.notes, logs: app.logs };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'talib-planner-data.json'; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-5">
      <PageTitle title={t('settings')} />
      <section className="card grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor="sn">{t('name')}</label><input id="sn" className="input" value={settings.name} onChange={(e) => set({ name: e.target.value })} /></div>
        <div />
        <div><label className="label" htmlFor="sc">{t('city')}</label><input id="sc" className="input" value={settings.city} onChange={(e) => set({ city: e.target.value })} /></div>
        <div><label className="label" htmlFor="sco">{t('country')}</label><input id="sco" className="input" value={settings.country} onChange={(e) => set({ country: e.target.value })} /></div>
        <div><label className="label" htmlFor="sl">{t('language')}</label>
          <select id="sl" className="input" value={settings.lang} onChange={(e) => set({ lang: e.target.value as 'en' | 'ur' })}><option value="en">English</option><option value="ur">اردو</option></select></div>
        <div><label className="label" htmlFor="st">{t('theme')}</label>
          <select id="st" className="input" value={settings.theme} onChange={(e) => set({ theme: e.target.value as 'light' | 'dark' })}><option value="light">{t('light')}</option><option value="dark">{t('dark')}</option></select></div>
      </section>
      <section className="card space-y-3">
        <p className="muted">{t('dataNote')}</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={exportData}>{t('exportData')}</button>
          <button className="btn btn-danger" onClick={() => window.confirm(t('confirmReset')) && app.resetAll()}>{t('resetData')}</button>
        </div>
      </section>
    </div>
  );
}
