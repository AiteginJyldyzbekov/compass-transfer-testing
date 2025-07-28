import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import React from 'react'
import { Badge } from '@shared/ui/data-display/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/ui/layout/card'

export function SectionCards() {
  return (
    <div className='flex flex-wrap gap-4 pl-4 pr-2 *:flex-1 *:basis-[calc(25%-100px)] *:min-w-[250px]'>
      <Card className='bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border'>
        <CardHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <CardDescription>Total Revenue</CardDescription>
            <Badge variant='outline'>
              <IconTrendingUp />
              +12.5%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            $1,250.00
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Trending up this month <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className='bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border'>
        <CardHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <CardDescription>New Customers</CardDescription>
            <Badge variant='outline'>
              <IconTrendingDown />
              -20%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            1,234
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Down 20% this period <IconTrendingDown className='size-4' />
          </div>
          <div className='text-muted-foreground'>Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className='bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border'>
        <CardHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <CardDescription>Active Accounts</CardDescription>
            <Badge variant='outline'>
              <IconTrendingUp />
              +12.5%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            45,678
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Strong user retention <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className='bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border'>
        <CardHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <CardDescription>Growth Rate</CardDescription>
            <Badge variant='outline'>
              <IconTrendingUp />
              +4.5%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            4.5%
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Steady performance increase <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
