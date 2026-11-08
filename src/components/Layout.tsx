import { NavLink, Outlet } from 'react-router-dom';
import { useT } from '../i18n';
import { useApp } from '../store';
import { DUAS } from '../data';

const MAIN = [
  { to: '/', key: 'home', icon: '🏠' },
  { to: '/timetable', key: 'timetable', icon: '🕌' },
  { to: '/dars', key: 'dars', icon: '📖' },
  { to: '/embedded', key: 'embedded', icon: '🔌' },
  { to: '/progress', key: 'progress', icon: '📊' },
];
const MORE = [
  { to: '/notes', key: 'notes', icon: '📝' },
  { to: '/settings', key: 'settings', icon: '⚙️' },
];

export default function Layout() {
  const { t, lang } = useT();
  const { settings, setSettings } = useApp();
  const dua = DUAS[new Date().getDate() % DUAS.length];
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-gold text-emerald-dark' : 'text-white/90 hover:bg-white/10'}`;

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="pattern fixed inset-y-0 start-0 z-30 hidden w-64 flex-col bg-emerald-dark p-4 md:flex">
        <div className="mb-6 mt-2 text-center">
          <div className="font-arabic text-2xl text-gold-light" aria-hidden>☪</div>
          <div className="font-arabic text-2xl font-bold text-white">{t('appName')}</div>
        </div>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
          {[...MAIN, ...MORE].map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkCls}>
              <span aria-hidden>{n.icon}</span>{t(n.key)}
            </NavLink>
          ))}
        </nav>
        <p className="mt-4 text-center font-arabic text-lg text-gold-light">{dua.ar}</p>
      </aside>

      <div className="md:ms-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-2 bg-emerald px-4 py-2 text-white shadow-md">
          <div className="flex items-center gap-2 md:hidden">
            <span className="font-arabic text-xl font-bold">{t('appName')}</span>
          </div>
          <div className="hidden font-arabic text-lg text-gold-light md:block">{t('bismillah')}</div>
          <div className="flex items-center gap-2">
            <button className="btn bg-white/15 text-white hover:bg-white/25" onClick={() => setSettings({ ...settings, lang: lang === 'en' ? 'ur' : 'en' })} aria-label={t('language')}>
              {lang === 'en' ? 'اردو' : 'English'}
            </button>
            <button className="btn bg-white/15 text-white hover:bg-white/25" onClick={() => setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })} aria-label={t('theme')}>
              {settings.theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <span className="md:hidden">
              {MORE.map((n) => (
                <NavLink key={n.to} to={n.to} className={({ isActive }) => `btn px-2 ${isActive ? 'bg-gold text-emerald-dark' : 'bg-white/15 text-white'}`} aria-label={t(n.key)}>
                  <span aria-hidden>{n.icon}</span>
                </NavLink>
              ))}
            </span>
          </div>
        </header>

        <main className="pattern mx-auto min-h-[calc(100vh-56px)] max-w-5xl px-4 pb-28 pt-6 md:pb-10">
          <Outlet />
          <footer className="mt-10 text-center">
            <div className="divider-star"><span aria-hidden>✦</span></div>
            <p className="mt-3 font-arabic text-xl text-emerald dark:text-gold-light">{dua.ar}</p>
            <p className="muted">{lang === 'ur' ? dua.ur : dua.en}</p>
          </footer>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-gold/40 bg-emerald-dark text-white md:hidden" aria-label="Main">
        {MAIN.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${isActive ? 'bg-gold text-emerald-dark' : ''}`}>
            <span className="text-lg" aria-hidden>{n.icon}</span>{t(n.key)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
