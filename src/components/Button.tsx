import { Loader2, type LucideIcon } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Tooltip } from './Tooltip';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-fg shadow-xs hover:brightness-110',
  secondary: 'border border-border/[0.14] bg-surface text-fg shadow-xs hover:border-border/[0.28] hover:bg-surface-2',
  soft: 'bg-primary/10 text-primary hover:bg-primary/[0.16]',
  ghost: 'text-muted hover:bg-fg/[0.06] hover:text-fg',
  danger: 'bg-danger text-white shadow-xs hover:brightness-110',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'gap-1.5 rounded-lg px-3 py-2 text-[13px]',
  md: 'gap-2 rounded-xl px-5 py-3 text-sm',
  lg: 'gap-2.5 rounded-xl px-6 py-3.5 text-[15px]',
};

const base =
  'btn inline-flex select-none items-center justify-center font-semibold leading-5 transition-[background-color,border-color,color,filter,transform,box-shadow] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Ocupa a largura toda. */
  full?: boolean;
  /** Ícone (Lucide) antes do texto. */
  icon?: LucideIcon;
  /** Ícone (Lucide) depois do texto. */
  iconRight?: LucideIcon;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, full, icon: Icon, iconRight: IconRight, className = '', children, disabled, ...rest },
  ref,
) {
  const iconSize = size === 'lg' ? 'h-[18px] w-[18px]' : 'h-4 w-4';
  return (
    <button ref={ref} className={`${base} btn-${variant} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Loader2 className={`${iconSize} shrink-0 animate-spin`} /> : Icon && <Icon className={`${iconSize} shrink-0`} strokeWidth={2} />}
      {children}
      {IconRight && <IconRight className={`${iconSize} shrink-0`} strokeWidth={2} />}
    </button>
  );
});

const iconSizes: Record<ButtonSize, string> = { sm: 'h-8 w-8 rounded-lg', md: 'h-10 w-10 rounded-xl', lg: 'h-12 w-12 rounded-xl' };

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  /** Diz o que o botão faz: vira a dica ao passar o mouse e o nome lido por leitores de tela. */
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

/** Botão só com ícone. Sempre tem dica (tooltip) explicando o que faz. */
export function IconButton({ icon: Icon, label, variant = 'ghost', size = 'md', loading, className = '', disabled, type = 'button', ...rest }: IconButtonProps) {
  return (
    <Tooltip title={label}>
      <button type={type} aria-label={label} className={`${base} tap ${variants[variant]} ${iconSizes[size]} ${className}`} disabled={disabled || loading} {...rest}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} strokeWidth={2} />}
      </button>
    </Tooltip>
  );
}
