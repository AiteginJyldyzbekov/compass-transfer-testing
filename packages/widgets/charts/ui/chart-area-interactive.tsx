'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, type ChartConfig } from '@shared/ui/data-display/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { chartData } from '@entities/charts';

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  // Диапазон времени: all – всё время, 90d – 90 дней, 30d – 30 дней, 7d – 7 дней
  const [timeRange, setTimeRange] = React.useState('all');

  const filteredData = React.useMemo(() => {
    if (timeRange === 'all') {
      return chartData;
    }

    // Используем последнюю дату из данных как "текущую" дату
    const lastDate = new Date('2024-04-30');
    let daysToSubtract = 90;

    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    // 90d остается по умолчанию

    const startDate = new Date(lastDate);

    startDate.setDate(startDate.getDate() - daysToSubtract);

    const filtered = chartData.filter(item => {
      const date = new Date(item.date);

      return date >= startDate;
    });

    return filtered;
  }, [timeRange]);

  return (
    <Card>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>Количество заказов по дням</CardTitle>
          <CardDescription>График заказов за выбранный период</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className='w-[160px] rounded-lg sm:ml-auto' aria-label='Select a value'>
            <SelectValue placeholder='Выберите период' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='all' className='rounded-lg'>
              Всё время
            </SelectItem>
            <SelectItem value='90d' className='rounded-lg'>
              Последние 3 месяца
            </SelectItem>
            <SelectItem value='30d' className='rounded-lg'>
              Последние 30 дней
            </SelectItem>
            <SelectItem value='7d' className='rounded-lg'>
              Последние 7 дней
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-0 pt-4 sm:px-0 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
          style={
            {
              '--color-desktop': 'var(--chart-1)',
              '--color-mobile': 'var(--chart-2)',
            } as React.CSSProperties
          }
        >
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id='fillDesktop' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='var(--color-desktop)' stopOpacity={1.0} />
                  <stop offset='95%' stopColor='var(--color-desktop)' stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id='fillMobile' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='var(--color-mobile)' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='var(--color-mobile)' stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value);

                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <Tooltip
                cursor={false}
                labelFormatter={(value: string) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <Area
                dataKey='mobile'
                type='natural'
                fill='url(#fillMobile)'
                stroke='var(--color-mobile)'
                stackId='a'
              />
              <Area
                dataKey='desktop'
                type='natural'
                fill='url(#fillDesktop)'
                stroke='var(--color-desktop)'
                stackId='a'
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
