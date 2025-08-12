'use client';

import { 
  Provider,
  Root,
  Trigger,
  Content as TooltipPrimitiveContent
} from '@radix-ui/react-tooltip';
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@shared/lib/utils';

const TooltipProvider = Provider;

const TooltipRoot = Root;

const TooltipTrigger = Trigger;

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitiveContent>,
  ComponentPropsWithoutRef<typeof TooltipPrimitiveContent> & {
    variant?: 'default' | 'premium';
  }
>(({ className, sideOffset = 4, variant = 'default', ...props }, ref) => (
  <TooltipPrimitiveContent
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Базовые стили
      'z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      // Варианты стилей
      variant === 'default' && 'rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
      variant === 'premium' && 'bg-black text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-white/20 duration-200 z-[99999]',
      className,
    )}
    {...props}
  />
));

TooltipContent.displayName = TooltipPrimitiveContent.displayName;

// Удобный компонент-обертка для простого использования
interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'premium';
  className?: string;
}

const SimpleTooltip = ({ content, children, side = 'top', variant = 'default' }: SimpleTooltipProps) => (
  <TooltipRoot>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent side={side} variant={variant}>
      <span className={cn(
        variant === 'premium' && 'text-sm font-medium italic whitespace-nowrap'
      )}>
        {content}
      </span>
    </TooltipContent>
  </TooltipRoot>
);

// Экспортируем как Tooltip для обратной совместимости и удобства
const Tooltip = TooltipRoot;

export { 
  Tooltip, 
  TooltipRoot,
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider,
  SimpleTooltip 
};
