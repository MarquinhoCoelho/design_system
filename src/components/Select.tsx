import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { Check, ChevronDown, Search, X, type LucideIcon } from 'lucide-react';
import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { FieldShell } from './Field';
import { filterOptions } from './selectSearch';

type Value = string | number;

export interface SelectOption<V extends Value = string> {
  value: V;
  label: string;
  /** Linha menor abaixo do nome, para explicar a opção. */
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  /** Opções seguidas com o mesmo grupo ficam sob um título. */
  group?: string;
}

interface CommonProps<V extends Value> {
  options: SelectOption<V>[];
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  /** Explicação longa num (i) ao lado do rótulo. */
  tip?: ReactNode;
  optional?: boolean;
  placeholder?: string;
  disabled?: boolean;
  /** Campo de busca dentro da lista. Padrão: aparece sozinho quando há mais de 7 opções. */
  searchable?: boolean;
  size?: 'sm' | 'md';
  id?: string;
  /** Nome do campo num formulário nativo (o valor vai num campo escondido). */
  name?: string;
  /** Com formulário nativo: impede o envio sem escolha. */
  required?: boolean;
  'aria-label'?: string;
  /** Texto quando a busca não acha nada. */
  emptyText?: string;
  /** Classe da moldura (rótulo + campo). */
  className?: string;
  /** Classe do campo em si (ex.: largura fixa). */
  triggerClassName?: string;
}

export interface SelectProps<V extends Value = string> extends CommonProps<V> {
  value: V | null | undefined;
  onChange: (value: V) => void;
}

export interface MultiSelectProps<V extends Value = string> extends CommonProps<V> {
  value: V[];
  onChange: (value: V[]) => void;
  /** Quantas etiquetas aparecem no campo antes de virar "+N". */
  maxChips?: number;
}

interface BaseProps<V extends Value> extends CommonProps<V> {
  multiple: boolean;
  selected: V[];
  onPick: (option: SelectOption<V>) => void;
  onSet: (values: V[]) => void;
  maxChips: number;
}

function SelectBase<V extends Value>({
  options,
  label,
  hint,
  error,
  tip,
  optional,
  placeholder,
  disabled,
  searchable,
  size = 'md',
  id,
  name,
  required,
  emptyText = 'Nada encontrado',
  className,
  triggerClassName = '',
  multiple,
  selected,
  onPick,
  onSet,
  maxChips,
  ...aria
}: BaseProps<V>) {
  const auto = useId();
  const triggerId = id ?? auto;
  const labelId = `${triggerId}-label`;
  const listId = `${triggerId}-list`;
  const withSearch = searchable ?? options.length > 7;
  // Sem rótulo visível, o texto de "nada escolhido" diz do que é a lista.
  const emptyLabel = placeholder ?? (label ? 'Selecione' : aria['aria-label'] ?? 'Selecione');

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const typingRef = useRef(false);

  const filtered = useMemo(() => filterOptions(options, query), [options, query]);
  const chosen = useMemo(() => options.filter((o) => selected.includes(o.value)), [options, selected]);
  const selectedIndex = multiple || !chosen[0] ? null : filtered.indexOf(chosen[0]);

  const { refs, floatingStyles, context, placement } = useFloating<HTMLDivElement>({
    open,
    onOpenChange: (next) => {
      setOpen(next);
      if (!next) {
        setQuery('');
        setActiveIndex(null);
      }
    },
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({ padding: 8 }),
      sizeMiddleware({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, { minWidth: `${rects.reference.width}px`, maxHeight: `${Math.max(180, Math.min(availableHeight, 360))}px` });
        },
      }),
    ],
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context, { enabled: !disabled }),
    useDismiss(context),
    useRole(context, { role: 'listbox' }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      selectedIndex: selectedIndex != null && selectedIndex >= 0 ? selectedIndex : null,
      onNavigate: setActiveIndex,
      virtual: withSearch,
      loop: true,
      focusItemOnOpen: true,
      disabledIndices: filtered.flatMap((o, i) => (o.disabled ? [i] : [])),
    }),
    useTypeahead(context, {
      listRef: { current: filtered.map((o) => o.label) },
      activeIndex,
      enabled: !withSearch && !disabled,
      onMatch: (i) => (open ? setActiveIndex(i) : !multiple && filtered[i] && !filtered[i].disabled && pick(filtered[i])),
      onTypingChange: (typing) => {
        typingRef.current = typing;
      },
    }),
  ]);

  /** Avisa formulários e janelas ("há alterações não salvas") de que o valor mudou, como um campo nativo faria. */
  function announce(next: string) {
    const el = hiddenRef.current;
    if (!el) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, next);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function pick(option: SelectOption<V>) {
    if (option.disabled) return;
    // Escolher de novo a mesma opção não conta como alteração.
    if (!multiple && selected.includes(option.value)) return context.onOpenChange(false);
    onPick(option);
    announce(`${String(option.value)}:${Date.now()}`);
    if (!multiple) context.onOpenChange(false);
  }

  function setAll(values: V[]) {
    onSet(values);
    announce(`${values.join(',')}:${Date.now()}`);
  }

  function onTriggerKeyDown(e: KeyboardEvent) {
    if (multiple && !open && (e.key === 'Backspace' || e.key === 'Delete') && chosen.length) setAll(selected.slice(0, -1));
  }

  const serialized = multiple ? selected.join(',') : chosen[0] ? String(chosen[0].value) : '';
  const SingleIcon = !multiple ? chosen[0]?.icon : undefined;
  const enabled = options.filter((o) => !o.disabled);
  let lastGroup: string | undefined;

  return (
    <FieldShell label={label && <span id={labelId}>{label}</span>} hint={hint} error={error} tip={tip} optional={optional} className={className}>
      <div className="relative">
        <div
          ref={refs.setReference}
          id={triggerId}
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={label ? `${labelId} ${triggerId}` : undefined}
          aria-label={aria['aria-label']}
          aria-invalid={error ? true : undefined}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          data-open={open}
          className={`input flex cursor-pointer select-none items-center gap-2 ${size === 'sm' ? 'input-sm' : ''} ${multiple && chosen.length ? 'flex-wrap !py-1.5' : ''} ${triggerClassName}`}
          {...getReferenceProps({ onKeyDown: onTriggerKeyDown })}
        >
          {multiple ? (
            chosen.length ? (
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                {chosen.slice(0, maxChips).map((o) => (
                  <span key={String(o.value)} className="inline-flex max-w-[180px] items-center gap-1 rounded-md bg-fg/[0.07] py-1 pl-2 pr-1 text-xs font-medium">
                    <span className="truncate">{o.label}</span>
                    {!disabled && (
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={`Remover ${o.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          pick(o);
                        }}
                        className="tap rounded p-0.5 text-muted transition-colors hover:bg-fg/10 hover:text-fg"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
                {chosen.length > maxChips && <span className="text-xs font-semibold text-muted">+{chosen.length - maxChips}</span>}
              </span>
            ) : (
              <span className="min-w-0 flex-1 truncate text-muted">{emptyLabel}</span>
            )
          ) : chosen[0] ? (
            <>
              {SingleIcon && <SingleIcon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />}
              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="truncate">{chosen[0].label}</span>
                {chosen[0].description && <span className="hidden shrink-0 text-xs text-muted sm:inline">{chosen[0].description}</span>}
              </span>
            </>
          ) : (
            <span className="min-w-0 flex-1 truncate text-muted">{emptyLabel}</span>
          )}
          <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
        {/* Campo escondido: leva o valor em formulários nativos, segura o "obrigatório" e avisa que algo mudou. */}
        <input ref={hiddenRef} tabIndex={-1} aria-hidden name={name} required={required} value={serialized} onChange={() => undefined} onInvalid={() => refs.domReference.current?.focus()} className="pointer-events-none absolute bottom-0 left-1/2 h-px w-px opacity-0" />
      </div>

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={withSearch ? searchRef : 0}>
            <div ref={refs.setFloating} style={floatingStyles} className="z-[70] flex max-w-[min(440px,calc(100vw-16px))] flex-col outline-none" {...getFloatingProps()} role="presentation" data-popover-open="">
              <div className="popover pop-in flex min-h-0 flex-1 flex-col overflow-hidden" style={{ '--origin': placement.startsWith('top') ? 'bottom left' : 'top left' } as CSSProperties}>
                {withSearch && (
                  <div className="flex shrink-0 items-center gap-2 border-b border-border/[0.08] px-3" data-no-dirty="">
                    <Search className="h-4 w-4 shrink-0 text-muted" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        e.preventDefault();
                        const option = activeIndex != null ? filtered[activeIndex] : undefined;
                        if (option) pick(option);
                      }}
                      placeholder="Buscar"
                      aria-label="Buscar opção"
                      aria-controls={listId}
                      aria-activedescendant={activeIndex != null ? `${listId}-${activeIndex}` : undefined}
                      className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/60"
                    />
                  </div>
                )}
                {multiple && enabled.length > 3 && !query && (
                  <div className="flex shrink-0 items-center justify-between border-b border-border/[0.08] px-3 py-2 text-xs font-semibold">
                    <button type="button" className="text-primary hover:underline" onClick={() => setAll(enabled.map((o) => o.value))}>Selecionar todos</button>
                    <button type="button" className="text-muted hover:text-fg disabled:opacity-40" disabled={!selected.length} onClick={() => setAll([])}>Limpar</button>
                  </div>
                )}
                <div id={listId} role="listbox" aria-multiselectable={multiple || undefined} className="nice-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-1">
                  {filtered.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted">{emptyText}</p>}
                  {filtered.map((o, i) => {
                    const isSelected = selected.includes(o.value);
                    const header = o.group && o.group !== lastGroup ? o.group : null;
                    lastGroup = o.group;
                    const Icon = o.icon;
                    return (
                      <div key={String(o.value)}>
                        {header && <p className="px-2.5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{header}</p>}
                        <div
                          id={`${listId}-${i}`}
                          ref={(node) => {
                            listRef.current[i] = node;
                          }}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={o.disabled || undefined}
                          data-active={activeIndex === i}
                          tabIndex={!withSearch && activeIndex === i ? 0 : -1}
                          className="option"
                          {...getItemProps({
                            onClick: () => pick(o),
                            onKeyDown: (e) => {
                              if (e.key === 'Enter' || (e.key === ' ' && !typingRef.current)) {
                                e.preventDefault();
                                pick(o);
                              }
                            },
                          })}
                        >
                          {multiple && (
                            <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border-[1.5px] transition-colors ${isSelected ? 'border-primary bg-primary text-primary-fg' : 'border-border/[0.28] bg-field'}`}>
                              {isSelected && <Check className="h-3 w-3" strokeWidth={3.5} />}
                            </span>
                          )}
                          {Icon && <Icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate">{o.label}</span>
                            {o.description && <span className="block truncate text-xs font-normal text-muted">{o.description}</span>}
                          </span>
                          {!multiple && isSelected && <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </FieldShell>
  );
}

/** Lista de escolha única, com teclado, busca (em listas longas), ícones e descrições. Substitui o <select> do navegador. */
export function Select<V extends Value = string>({ value, onChange, ...rest }: SelectProps<V>) {
  return <SelectBase {...rest} multiple={false} selected={value == null ? [] : [value]} onPick={(o) => onChange(o.value)} onSet={() => undefined} maxChips={0} />;
}

/** Lista de escolha múltipla: as escolhas viram etiquetas no campo, com "Selecionar todos" e "Limpar". */
export function MultiSelect<V extends Value = string>({ value, onChange, maxChips = 3, ...rest }: MultiSelectProps<V>) {
  return (
    <SelectBase
      {...rest}
      multiple
      selected={value}
      onPick={(o) => onChange(value.includes(o.value) ? value.filter((v) => v !== o.value) : [...value, o.value])}
      onSet={onChange}
      maxChips={maxChips}
    />
  );
}
