import { CircleAlert, CircleCheck, Info, Inbox, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from 'react';
import { Switch } from './controls';

export { TextArea } from './Field';

export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`card p-5 sm:p-6 ${className}`} style={style}>{children}</div>;
}

const BADGE = {
  green: 'bg-success/[0.12] text-success',
  yellow: 'bg-warning/[0.14] text-warning',
  red: 'bg-danger/[0.12] text-danger',
  gray: 'bg-fg/[0.07] text-muted',
  primary: 'bg-primary/[0.12] text-primary',
} as const;
export type BadgeColor = keyof typeof BADGE;

/** Etiqueta de estado. `dot` põe uma bolinha da mesma cor antes do texto; `icon` aceita um ícone Lucide. */
export function Badge({ color = 'gray', dot, icon: Icon, children }: { color?: BadgeColor; dot?: boolean; icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={`badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[color]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
      {children}
    </span>
  );
}

/** Chave liga/desliga com rótulo (nome antigo do Switch, mantido para as telas existentes). */
export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return <Switch checked={checked} onChange={onChange} label={label} hint={hint} />;
}

const ALERT = {
  info: { box: 'border-primary/25 bg-primary/[0.06]', icon: 'text-primary', Icon: Info },
  success: { box: 'border-success/25 bg-success/[0.07]', icon: 'text-success', Icon: CircleCheck },
  warning: { box: 'border-warning/30 bg-warning/[0.08]', icon: 'text-warning', Icon: TriangleAlert },
  danger: { box: 'border-danger/25 bg-danger/[0.07]', icon: 'text-danger', Icon: CircleAlert },
} as const;

/** Aviso fixo dentro da página (o que houve e o que fazer). Para aviso rápido que some sozinho, use toast. */
export function Alert({ tone = 'info', title, children, action, className = '' }: { tone?: keyof typeof ALERT; title?: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  const t = ALERT[tone];
  return (
    <div role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'} className={`flex gap-3 rounded-xl border p-4 text-sm ${t.box} ${className}`}>
      <t.Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${t.icon}`} strokeWidth={2} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={`text-fg/80 ${title ? 'mt-0.5' : ''}`}>{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

const AVATAR = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' } as const;

/** Foto da pessoa ou, sem foto, as iniciais sobre a cor da marca. */
export function Avatar({ name, src, size = 'md' }: { name: string; src?: string | null; size?: keyof typeof AVATAR }) {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';
  return src ? (
    <img src={src} alt={name} className={`shrink-0 rounded-full object-cover ${AVATAR[size]}`} />
  ) : (
    <span aria-label={name} className={`flex shrink-0 select-none items-center justify-center rounded-full bg-primary/[0.14] font-bold text-primary ${AVATAR[size]}`}>{initials}</span>
  );
}

// Modais abertos, do mais antigo ao mais novo: Esc fecha só o de cima (ex.: a confirmação sobre um formulário).
const openModals: number[] = [];
let modalSeq = 0;

export function Modal({ open, onClose, title, children, wide, dirty }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean; /** Força (true/false) o aviso de descarte. Sem ele, o aviso aparece se a pessoa digitou ou escolheu algo na janela. */ dirty?: boolean }) {
  const [id] = useState(() => ++modalSeq);
  // Mexeu em algum campo desde que a janela abriu?
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!open) setTouched(false);
  }, [open]);
  // Digitar na busca de uma lista (data-no-dirty) não conta como alteração.
  const markTouched = (e: { target: EventTarget }) => {
    if (!(e.target as HTMLElement).closest?.('[data-no-dirty]')) setTouched(true);
  };
  const latest = useRef({ onClose, dirty: dirty ?? touched });
  latest.current = { onClose, dirty: dirty ?? touched };
  const requestClose = useCallback(async () => {
    if (latest.current.dirty) {
      const { ask } = await import('./ConfirmDialog');
      if (!(await ask({ title: 'Descartar o que você preencheu?', message: 'As informações desta janela ainda não foram salvas.', confirm: 'Descartar', cancel: 'Continuar editando', danger: true }))) return;
    }
    latest.current.onClose();
  }, []);
  useEffect(() => {
    if (!open) return;
    openModals.push(id);
    const esc = (e: KeyboardEvent) => {
      // Com uma lista (Select) aberta, o Esc fecha só a lista.
      if (e.key === 'Escape' && openModals[openModals.length - 1] === id && !document.querySelector('[data-popover-open]')) {
        e.stopPropagation();
        void requestClose();
      }
    };
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('keydown', esc);
      const i = openModals.indexOf(id);
      if (i >= 0) openModals.splice(i, 1);
    };
  }, [open, id, requestClose]);
  if (!open) return null;
  // Portal no <body>: dentro de um "space-y-*" o fundo escuro ganhava margin-top e deixava uma faixa sem cobrir.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4" onMouseDown={() => void requestClose()}>
      {/* Altura limitada à tela: o cabeçalho fica fixo e só o conteúdo rola. */}
      <div className={`card pop-in flex max-h-[calc(100dvh-1.5rem)] w-full flex-col sm:max-h-[calc(100dvh-2rem)] ${wide ? 'max-w-3xl' : 'max-w-lg'}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex shrink-0 items-center justify-between gap-3 px-6 pb-4 pt-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" onClick={() => void requestClose()} aria-label="Fechar" className="-mr-1 rounded-lg p-1 text-muted hover:bg-fg/5 hover:text-fg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="nice-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6" onInputCapture={markTouched} onChangeCapture={markTouched}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Lista vazia: ícone, título, explicação e a ação que leva ao próximo passo. */
export function EmptyState({ title, children, icon: Icon = Inbox, action }: { title: string; children?: ReactNode; icon?: ComponentType<{ className?: string }>; action?: ReactNode }) {
  return (
    <div className="rise-in flex flex-col items-center rounded-2xl border border-dashed border-border/[0.15] px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
      <p className="mt-4 font-semibold">{title}</p>
      {children && <div className="mx-auto mt-1.5 max-w-md text-sm text-muted">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Abas de uma página. Em telas estreitas a fileira rola de lado, sem barra de rolagem. */
export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: string; icon?: LucideIcon; count?: number }[] }) {
  return (
    <div role="tablist" className="no-scrollbar mb-6 flex gap-1 overflow-x-auto border-b border-border/10">
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.id)}
            className={`-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 ${on ? 'border-primary text-primary' : 'border-transparent text-muted hover:border-border/20 hover:text-fg'}`}
          >
            {it.icon && <it.icon className="h-4 w-4" strokeWidth={2} />}
            {it.label}
            {it.count != null && <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${on ? 'bg-primary/[0.12]' : 'bg-fg/[0.07]'}`}>{it.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Barra de consumo com marcas de "aviso" e "máximo" (limites do plano). */
export function UsageBar({ label, value, soft, hard, format }: { label: string; value: number; soft: number | null; hard: number | null; format: (n: number) => string }) {
  const max = hard ?? soft ?? Math.max(value, 1);
  const pct = Math.min(100, (value / max) * 100);
  const softPct = soft != null && hard ? (soft / hard) * 100 : null;
  const color = hard != null && value >= hard ? 'bg-danger' : soft != null && value > soft ? 'bg-warning' : 'bg-primary';
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted">
          {format(value)} {hard != null ? `de ${format(hard)}` : '(ilimitado)'}
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
        {softPct != null && <div className="absolute top-0 h-full w-0.5 bg-warning" style={{ left: `${softPct}%` }} title="Limite de aviso" />}
      </div>
      {soft != null && <p className="mt-1 text-xs text-muted">Aviso em {format(soft)}{hard != null ? ` · bloqueio em ${format(hard)}` : ''}</p>}
    </div>
  );
}

export function Spinner() {
  return <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
}
