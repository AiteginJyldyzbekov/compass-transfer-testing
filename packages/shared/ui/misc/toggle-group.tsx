import { forwardRef, createContext, useContext, useMemo, type HTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { cn } from '@shared/lib/utils';

interface ToggleGroupContextValue {
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({});

interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  orientation?: 'horizontal' | 'vertical';
}

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    { className, type = 'single', value, onValueChange, orientation = 'horizontal', ...props },
    ref,
  ) => {
    return (
      <ToggleGroupContext.Provider value={{ value, onValueChange, type }}>
        <div
          ref={ref}
          className={cn('flex', orientation === 'horizontal' ? 'flex-row' : 'flex-col', className)}
          {...props}
        />
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';

interface ToggleGroupItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, variant = 'default', size = 'default', ...props }, ref) => {
    const context = useContext(ToggleGroupContext);

    const isPressed = useMemo(() => {
      if (!context.value) return false;

      if (context.type === 'multiple' && Array.isArray(context.value)) {
        return context.value.includes(value);
      }

      return context.value === value;
    }, [context.value, context.type, value]);

    const handleClick = () => {
      if (!context.onValueChange) return;

      if (context.type === 'multiple') {
        const currentValue = Array.isArray(context.value) ? context.value : [];
        const newValue = isPressed
          ? currentValue.filter(v => v !== value)
          : [...currentValue, value];

        context.onValueChange(newValue);
      } else {
        context.onValueChange(isPressed ? '' : value);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'h-10 px-3': size === 'default',
            'h-9 px-2.5': size === 'sm',
            'h-11 px-5': size === 'lg',
            'bg-transparent': variant === 'default' && !isPressed,
            'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground':
              variant === 'outline' && !isPressed,
            'bg-accent text-accent-foreground': isPressed,
          },
          className,
        )}
        data-state={isPressed ? 'on' : 'off'}
        aria-pressed={isPressed}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
