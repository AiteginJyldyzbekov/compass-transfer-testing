import { Root as SeparatorPrimitiveRoot } from '@radix-ui/react-separator';
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@shared/lib/utils';

const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitiveRoot>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitiveRoot>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitiveRoot
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
));

Separator.displayName = 'Separator';

export { Separator };
