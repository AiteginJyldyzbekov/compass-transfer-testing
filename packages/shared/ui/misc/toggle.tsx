import { forwardRef, useState, useEffect, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { cn } from '@shared/lib/utils';

interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, variant = 'default', size = 'default', pressed, onPressedChange, ...props },
    ref,
  ) => {
    const [isPressed, setIsPressed] = useState(pressed || false);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      const newPressed = !isPressed;

      setIsPressed(newPressed);
      onPressedChange?.(newPressed);
      props.onClick?.(event);
    };

    useEffect(() => {
      if (pressed !== undefined) {
        setIsPressed(pressed);
      }
    }, [pressed]);

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
          {
            'h-10 px-3': size === 'default',
            'h-9 px-2.5': size === 'sm',
            'h-11 px-5': size === 'lg',
            'bg-transparent': variant === 'default',
            'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground':
              variant === 'outline',
            'bg-accent text-accent-foreground': isPressed,
          },
          className,
        )}
        data-state={isPressed ? 'on' : 'off'}
        aria-pressed={isPressed}
        {...props}
        onClick={handleClick}
      />
    );
  },
);

Toggle.displayName = 'Toggle';

export { Toggle };
