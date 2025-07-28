'use client';

import React from 'react';
import { cn } from '@shared/lib/utils';

export interface ChartConfig {
  [k: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  };
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
  }
>(({ className, config, children, ...props }, ref) => {
  const chartVars = React.useMemo(() => {
    const vars: Record<string, string> = {};

    Object.entries(config).forEach(([key, value]) => {
      if (value.color) {
        vars[`--color-${key}`] = value.color;
      }
    });

    return vars;
  }, [config]);

  return (
    <div
      ref={ref}
      className={cn('w-full h-full', className)}
      style={chartVars as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
});

ChartContainer.displayName = 'ChartContainer';

// Правильные компоненты для recharts
const ChartTooltip = ({ children, ...props }: React.ComponentProps<'div'>) => {
  if (!React.isValidElement(children)) {
    return null;
  }
  return React.cloneElement(children, props);
};

const ChartTooltipContent = ({ children, ...props }: React.ComponentProps<'div'>) => {
  if (!React.isValidElement(children)) {
    return null;
  }
  return React.cloneElement(children, props);
};

const ChartLegend = ({ children, ...props }: React.ComponentProps<'div'>) => {
  if (!React.isValidElement(children)) {
    return null;
  }
  return React.cloneElement(children, props);
};

const ChartLegendContent = ({ children, ...props }: React.ComponentProps<'div'>) => {
  if (!React.isValidElement(children)) {
    return null;
  }
  return React.cloneElement(children, props);
};

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };
