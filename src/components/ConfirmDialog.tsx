import { AlertTriangle } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './kit';

export interface AskOptions {
  title?: string;
  message?: ReactNode;
  /** Texto do botão de confirmar (padrão: "Confirmar"). */
  confirm?: string;
  cancel?: string;
  /** Ação destrutiva (apagar, estornar…): botão vermelho. */
  danger?: boolean;
}

type Pending = AskOptions & { resolve: (ok: boolean) => void };
let show: ((p: Pending) => void) | null = null;

/**
 * Confirmação com a cara da plataforma, no lugar do confirm() do navegador.
 * Uso: `if (!(await ask({ title: 'Excluir aula?', danger: true, confirm: 'Excluir' }))) return;`
 */
export function ask(opts: AskOptions | string): Promise<boolean> {
  const o = typeof opts === 'string' ? { title: opts } : opts;
  if (!show) return Promise.resolve(window.confirm([o.title, typeof o.message === 'string' ? o.message : ''].filter(Boolean).join('\n\n')));
  return new Promise((resolve) => show!({ ...o, resolve }));
}

/** Montado uma vez na raiz do app. */
export function ConfirmHost() {
  const [p, setP] = useState<Pending | null>(null);
  useEffect(() => {
    show = (next) => setP(next);
    return () => {
      show = null;
    };
  }, []);
  const done = (ok: boolean) => {
    p?.resolve(ok);
    setP(null);
  };
  return (
    <Modal open={!!p} onClose={() => done(false)} title={p?.title ?? 'Tem certeza?'}>
      {p && (
        <div className="space-y-5">
          {p.message && (
            <div className="flex gap-3 text-[15px] leading-relaxed text-muted">
              {p.danger && <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />}
              <div>{p.message}</div>
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {/* Foco no "Cancelar": Enter por engano nunca apaga nada. */}
            <Button autoFocus type="button" variant="ghost" onClick={() => done(false)}>{p.cancel ?? 'Cancelar'}</Button>
            <Button type="button" variant={p.danger ? 'danger' : 'primary'} onClick={() => done(true)}>{p.confirm ?? 'Confirmar'}</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
