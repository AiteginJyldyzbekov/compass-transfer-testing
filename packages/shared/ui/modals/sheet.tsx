import React from 'react';
import { cn } from '@shared/lib/utils';

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet = ({ children, open, onOpenChange }: SheetProps) => {
  // Обработчик клавиши Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onOpenChange) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[1000] pointer-events-auto'
      onClick={(e) => {
        // Закрываем Sheet при клике на overlay
        if (e.target === e.currentTarget && onOpenChange) {
          onOpenChange(false);
        }
      }}
    >
      {children}
    </div>
  );
};

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = 'right', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fixed inset-y-0 right-0 z-[1003] h-full w-3/4 border-l bg-background px-2 py-2 shadow-lg transition-all duration-300 ease-out pointer-events-auto transform animate-slide-in-right',
        side === 'right' && 'translate-x-0',
        side === 'left' && 'left-0 translate-x-0',
        side === 'top' && 'top-0 inset-x-0 h-3/4 translate-y-0',
        side === 'bottom' && 'bottom-0 inset-x-0 h-3/4 translate-y-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

SheetContent.displayName = 'SheetContent';

interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SheetHeader = ({ children, className, ...props }: SheetHeaderProps) => (
  <div
    className={cn('flex flex-col space-y-2 text-center sm:text-left mb-4', className)}
    {...props}
  >
    {children}
  </div>
);

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
  ),
);

SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

SheetDescription.displayName = 'SheetDescription';

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription };
