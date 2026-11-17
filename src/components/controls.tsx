import type { LucideIcon } from 'lucide-react';
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  /** Explicação menor abaixo do rótulo. */
  hint?: ReactNode;
}

function Choice({ kind, label, hint, className = '', inputRef, ...rest }: ChoiceProps & { kind: 'checkbox' | 'radio'; inputRef: React.Ref<HTMLInputElement> }) {
  return (
    <label className={`flex items-start gap-2.5 text-sm ${rest.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}>
      <input ref={inputRef} type={kind} className="mt-px" {...rest} />
      <span className="min-w-0">
        <span className="block font-medium leading-5">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** Caixa de marcar com rótulo. Para ligar/desligar algo que vale na hora, use Switch. */
export const Checkbox = forwardRef<HTMLInputElement, ChoiceProps>(function Checkbox(props, ref) {
  return <Choice kind="checkbox" inputRef={ref} {...props} />;
});

/** Uma opção de escolha única. Para o grupo todo, prefira RadioGroup. */
export const Radio = forwardRef<HTMLInputElement, ChoiceProps>(function Radio(props, ref) {
  return <Choice kind="radio" inputRef={ref} {...props} />;
});

export interface RadioOption<V extends string | number = string> {
  value: V;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

/** Escolha única entre poucas opções, todas visíveis. `cards` desenha cada opção como um cartão clicável. */
export function RadioGroup<V extends string | number = string>({
  label,
  value,
  onChange,
  options,
  cards,
  columns = 1,
  name,
}: {
  label?: ReactNode;
  value: V | null | undefined;
  onChange: (value: V) => void;
  options: RadioOption<V>[];
  cards?: boolean;
  columns?: 1 | 2 | 3;
  name?: string;
}) {
  const auto = useId();
  const cols = columns === 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : '';
  return (
    <fieldset>
      {label && <legend className="label">{label}</legend>}
      <div className={`grid gap-2.5 ${cols}`}>
        {options.map((o) => (
          <Radio
            key={String(o.value)}
            name={name ?? auto}
            label={o.label}
            hint={o.hint}
            disabled={o.disabled}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className={cards ? `rounded-xl border p-3.5 transition-colors ${value === o.value ? 'border-primary bg-primary/[0.06]' : 'border-border/[0.14] hover:border-border/[0.28]'}` : ''}
          />
        ))}
      </div>
    </fieldset>
  );
}

/** Chave liga/desliga: o efeito vale na hora (ou ao salvar o formulário). */
export function Switch({ checked, onChange, label, hint, disabled, size = 'md' }: { checked: boolean; onChange: (value: boolean) => void; label?: ReactNode; hint?: ReactNode; disabled?: boolean; size?: 'sm' | 'md' }) {
  const small = size === 'sm';
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${small ? 'h-5 w-9' : 'h-6 w-11'} ${checked ? 'bg-primary' : 'bg-fg/[0.16]'}`}
    >
      <span className={`block rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.3)] transition-transform duration-200 ease-[var(--ease-out)] ${small ? 'h-4 w-4' : 'h-5 w-5'} ${checked ? (small ? 'translate-x-4' : 'translate-x-5') : ''}`} />
    </button>
  );
  if (!label) return control;
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <span className="mt-0.5 inline-flex">{control}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** Alternador de poucas opções lado a lado (ex.: período, modo de visualização). */
export function Segmented<V extends string | number = string>({
  value,
  onChange,
  options,
  size = 'md',
  full,
  'aria-label': ariaLabel,
}: {
  value: V;
  onChange: (value: V) => void;
  options: { value: V; label: ReactNode; icon?: LucideIcon }[];
  size?: 'sm' | 'md';
  full?: boolean;
  'aria-label'?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={`inline-flex gap-1 rounded-xl bg-fg/[0.06] p-1 ${full ? 'flex w-full' : ''}`}>
      {options.map((o) => {
        const on = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-[background-color,color,box-shadow] duration-150 ${full ? 'flex-1' : ''} ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-[13px]'} ${on ? 'bg-surface text-fg shadow-xs' : 'text-muted hover:text-fg'}`}
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
