import { ReactNode } from 'react';

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-emerald/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-gradient-to-r from-emerald to-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Ring({ value, max, label, sub }: { value: number; max: number; label: string; sub: string }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = 38, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <svg viewBox="0 0 100 100" className="h-24 w-24" role="img" aria-label={`${label} ${Math.round(pct * 100)}%`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="9" className="text-emerald" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#C9A227" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 50 50)" />
        <text x="50" y="56" textAnchor="middle" className="fill-emerald text-[20px] font-bold dark:fill-gold-light">{Math.round(pct * 100)}%</text>
      </svg>
      <div className="text-sm font-semibold">{label}</div>
      <div className="muted">{sub}</div>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="h1">{title}</h1>
      {subtitle && <p className="muted mt-1">{subtitle}</p>}
      <div className="divider-star mt-3"><span aria-hidden>✦</span></div>
    </div>
  );
}

export function Empty({ icon, text, children }: { icon: string; text: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-10 text-center">
      <div className="text-4xl" aria-hidden>{icon}</div>
      <p className="muted max-w-sm">{text}</p>
      {children}
    </div>
  );
}
