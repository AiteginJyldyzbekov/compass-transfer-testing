import React from 'react';
import { cn } from '@shared/lib/utils';

interface SpinnerProps {
  /** Размер спинера */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Дополнительные CSS классы */
  className?: string;
  /** Цвет спинера */
  variant?: 'primary' | 'secondary' | 'white';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  primary: 'border-primary',
  secondary: 'border-muted-foreground',
  white: 'border-white',
};

/**
 * Компонент спинера для индикации загрузки
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  variant = 'primary',
}) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-transparent',
        sizeClasses[size],
        `${variantClasses[variant]} border-t-transparent`,
        className,
      )}
      role='status'
      aria-label='Загрузка'
    />
  );
};

/**
 * Компонент оверлея с спинером
 */
interface SpinnerOverlayProps {
  /** Показать оверлей */
  show: boolean;
  /** Текст загрузки */
  text?: string;
  /** Размер спинера */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Дополнительные CSS классы */
  className?: string;
}

export const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({
  show,
  text = 'Загрузка...',
  size = 'lg',
  className,
}) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]',
        className,
      )}
    >
      <Spinner size={size} />
      {text && <p className='mt-3 text-sm text-muted-foreground font-medium'>{text}</p>}
    </div>
  );
};
