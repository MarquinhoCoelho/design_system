import { CircleAlert, Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { InfoTip } from './Tooltip';

export interface FieldShellProps {
  label?: ReactNode;
  /** Explicação curta abaixo do campo. Some quando há erro. */
  hint?: ReactNode;
  error?: string;
  /** Explicação longa num (i) ao lado do rótulo. */
  tip?: ReactNode;
  /** Marca o rótulo como opcional. */
  optional?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

/** Moldura de qualquer campo: rótulo em cima, dica ou erro embaixo. Usada por Field, TextArea, Select e MultiSelect. */
export function FieldShell({ label, hint, error, tip, optional, htmlFor, className = '', children }: FieldShellProps) {
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center gap-1.5">
          <label className="label !mb-0" htmlFor={htmlFor}>{label}</label>
          {optional && <span className="text-xs text-muted">(opcional)</span>}
          {tip && <InfoTip text={tip} />}
        </div>
      )}
      {children}
      {error ? (
        <p className="field-error" role="alert"><CircleAlert className="h-3.5 w-3.5 shrink-0" />{error}</p>
      ) : (
        hint && <p className="field-hint">{hint}</p>
      )}
    </div>
  );
}

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  tip?: ReactNode;
  optional?: boolean;
  /** Ícone (Lucide) dentro do campo, à esquerda. */
  icon?: LucideIcon;
  /** Texto fixo antes do valor (ex.: "R$"). */
  prefix?: ReactNode;
  /** Texto fixo depois do valor (ex.: "%", ".vivitsolucoes.com.br"). */
  suffix?: ReactNode;
  size?: 'sm' | 'md';
  /** Classe da moldura (rótulo + campo). `className` vai para o campo em si. */
  wrapperClassName?: string;
}

/** Campo de texto de uma linha. Senha ganha o botão de mostrar/esconder. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, tip, optional, icon: Icon, prefix, suffix, size = 'md', id, type, className = '', wrapperClassName, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? rest.name ?? auto;
  const [show, setShow] = useState(false);
  const password = type === 'password';
  const affix = prefix != null || suffix != null;
  const input = (
    <input
      ref={ref}
      id={inputId}
      type={password && show ? 'text' : type}
      aria-invalid={error ? true : undefined}
      className={
        affix
          ? `min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-muted/60 disabled:cursor-not-allowed ${className}`
          : `input ${size === 'sm' ? 'input-sm' : ''} ${password ? '!pr-11' : ''} ${Icon ? '!pl-10' : ''} ${className}`
      }
      {...rest}
    />
  );
  return (
    <FieldShell label={label} hint={hint} error={error} tip={tip} optional={optional} htmlFor={inputId} className={wrapperClassName}>
      {affix ? (
        <div className={`input flex items-center gap-2 ${size === 'sm' ? 'input-sm' : ''}`} aria-invalid={error ? true : undefined} aria-disabled={rest.disabled || undefined}>
          {Icon && <Icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />}
          {prefix != null && <span className="shrink-0 select-none text-muted">{prefix}</span>}
          {input}
          {suffix != null && <span className="max-w-[60%] select-none truncate text-muted">{suffix}</span>}
        </div>
      ) : (
        <div className="relative">
          {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} />}
          {input}
          {password && (
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
              aria-pressed={show}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted transition-colors hover:text-fg"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      )}
    </FieldShell>
  );
});

/** Mesmo componente, com o nome usual de design system. */
export const Input = Field;

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  tip?: ReactNode;
  optional?: boolean;
  /** Mostra "usados/máximo" quando há maxLength. */
  counter?: boolean;
  wrapperClassName?: string;
}

/** Campo de texto de várias linhas. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ label, error, hint, tip, optional, counter, id, className = '', wrapperClassName, ...rest }, ref) {
  const auto = useId();
  const inputId = id ?? rest.name ?? auto;
  const used = typeof rest.value === 'string' ? rest.value.length : null;
  const count = counter && rest.maxLength != null && used != null ? `${used}/${rest.maxLength}` : null;
  return (
    <FieldShell label={label} error={error} tip={tip} optional={optional} htmlFor={inputId} className={wrapperClassName} hint={hint || count ? <span className="flex justify-between gap-3"><span>{hint}</span>{count && <span className="shrink-0 tabular-nums">{count}</span>}</span> : undefined}>
      <textarea ref={ref} id={inputId} aria-invalid={error ? true : undefined} className={`input ${className}`} {...rest} />
    </FieldShell>
  );
});
