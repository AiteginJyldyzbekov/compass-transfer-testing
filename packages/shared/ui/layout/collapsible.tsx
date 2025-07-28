'use client';

import { forwardRef, type ReactNode } from 'react';
import { cn } from '@shared/lib/utils';

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

const Collapsible = ({ open, onOpenChange: _onOpenChange, children, className }: CollapsibleProps) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};

interface CollapsibleTriggerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const CollapsibleTrigger = ({ children, className, onClick }: CollapsibleTriggerProps) => {
  return (
    <div className={cn('cursor-pointer', className)} onClick={onClick}>
      {children}
    </div>
  );
};

interface CollapsibleContentProps {
  children: ReactNode;
  className?: string;
}

const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn('', className)}>
        {children}
      </div>
    );
  }
);

CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
