import React from 'react';
import { cn } from '@shared/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('', className)}
      {...props}
    />
  ),
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col p-4', className)} {...props} />
  ),
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-4 pb-4 w-full h-full', className)} {...props} />
  ),
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-4', className)} {...props} />
  ),
);

CardFooter.displayName = 'CardFooter';

const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center', className)} {...props} />
  ),
);

CardAction.displayName = 'CardAction';

// Новые компоненты для метрик
const CardValue = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-3xl font-bold tracking-tight text-foreground', className)}
      {...props}
    />
  ),
);

CardValue.displayName = 'CardValue';

const CardTrend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    trend?: 'up' | 'down' | 'neutral';
    percentage?: string;
  }
>(({ className, trend = 'neutral', percentage, children, ...props }, ref) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  const trendIcon = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-1 text-sm font-medium', trendColors[trend], className)}
      {...props}
    >
      <span className='text-xs'>{trendIcon[trend]}</span>
      {percentage && <span>{percentage}</span>}
      {children}
    </div>
  );
});

CardTrend.displayName = 'CardTrend';

const CardMetric = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    percentage?: string;
    description?: string;
  }
>(({ className, title, value, trend, percentage, description, ...props }, ref) => (
  <Card ref={ref} className={cn('', className)} {...props}>
    <CardHeader>
      <div className='flex items-center justify-between'>
        <CardTitle>{title}</CardTitle>
        {trend && percentage && <CardTrend trend={trend} percentage={percentage} />}
      </div>
    </CardHeader>
    <CardContent className='pt-0'>
      <CardValue>{value}</CardValue>
      {description && <CardDescription className='mt-2'>{description}</CardDescription>}
    </CardContent>
  </Card>
));

CardMetric.displayName = 'CardMetric';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardValue,
  CardTrend,
  CardMetric,
};
