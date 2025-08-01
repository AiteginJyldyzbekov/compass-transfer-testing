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
            <CardDescription>Общий доход</CardDescription>
            <Badge variant='outline'>
              <IconTrendingUp />
              0%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            $0
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Тенденция к росту в этом месяце <IconTrendingUp className='size-4' />
          </div>
        </CardFooter>
      </Card>
      <Card className='bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border'>
        <CardHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <CardDescription>Новые пользователи</CardDescription>
            <Badge variant='outline'>
              <IconTrendingDown />
              0%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            0
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Рост на 0% за этот период<IconTrendingDown className='size-4' />
          </div>
        </CardFooter>
      </Card>
      <Card className='bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border'>
        <CardHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <CardDescription>Количество заказов</CardDescription>
            <Badge variant='outline'>
              <IconTrendingUp />
              0%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            0
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Стабильное количество заказов <IconTrendingUp className='size-4' />
          </div>
        </CardFooter>
      </Card>
      <Card className='bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border'>
        <CardHeader className='pb-0'>
          <div className='flex items-center justify-between'>
            <CardDescription>Темпы роста</CardDescription>
            <Badge variant='outline'>
              <IconTrendingUp />
              0%
            </Badge>
          </div>
          <CardTitle className='text-3xl font-bold tabular-nums @[250px]/card:text-3xl pt-2'>
            0%
          </CardTitle>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Устойчивый рост производительности <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Соответствует прогнозам роста</div>
        </CardFooter>
      </Card>
    </div>
  );
}
