import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  type Placement,
} from '@floating-ui/react';
import { Info } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';

/**
 * Dica curta ao passar o mouse, focar pelo teclado ou tocar (balão escuro com seta).
 * Uma frase dizendo o que acontece ou para que serve.
 */
export function Tooltip({ title, children, placement = 'top', className = '' }: { title: ReactNode; children: ReactNode; placement?: Placement; className?: string }) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ fallbackAxisSideDirection: 'start' }), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false, delay: { open: 250, close: 0 } }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);
  if (!title) return <>{children}</>;
  return (
    <>
      <span ref={refs.setReference} data-has-tip="" {...getReferenceProps({ onClick: () => setOpen((v) => !v) })} className={`inline-flex ${className}`}>
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={{ ...floatingStyles, visibility: isPositioned ? 'visible' : 'hidden' }} {...getFloatingProps()} className="z-[100] max-w-[260px] fade-in rounded-lg bg-neutral-800 px-3.5 py-2 text-[13px] font-medium leading-snug text-white shadow-lg">
            {title}
            <FloatingArrow ref={arrowRef} context={context} className="fill-neutral-800" />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

/** Ícone (i) ao lado de um rótulo, com a explicação no tooltip. */
export function InfoTip({ text, className = '' }: { text: ReactNode; className?: string }) {
  return (
    <Tooltip title={text} className={className}>
      <button type="button" className="tap inline-flex text-muted hover:text-fg" aria-label="Mais informações">
        <Info className="h-4 w-4" />
      </button>
    </Tooltip>
  );
}
