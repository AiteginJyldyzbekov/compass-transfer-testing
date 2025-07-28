import React from 'react';
import { cn } from '@shared/lib/utils';

interface WidgetFooterProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'green' | 'blue';
}

export function WidgetFooter({ className, variant = 'default', ...props }: WidgetFooterProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return 'border-green-300/30 bg-green-600/20';
      case 'blue':
        return 'border-blue-300/30 bg-blue-600/20';
      default:
        return 'border-gray-300/30 bg-gray-600/20';
    }
  };

  return (
    <div
      className={cn(
        'flex-shrink-0 p-4 border-t',
        getVariantStyles(),
        className
      )}
      {...props}
    />
  );
}
