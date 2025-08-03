'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import type { GetOrderDTO } from '@entities/orders/interface';

interface UserOrdersTablePaginationProps {
  paginatedOrders: GetOrderDTO[];
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPageNumber: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleFirstPage: () => void;
}

export function UserOrdersTablePagination({
  paginatedOrders,
  totalCount,
  pageSize,
  hasNext,
  hasPrevious,
  currentPageNumber,
  handleNextPage,
  handlePrevPage,
  handleFirstPage,
}: UserOrdersTablePaginationProps) {
  // Вычисляем общее количество страниц
  const totalPagesCalculated = Math.ceil(totalCount / pageSize);

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-sm text-muted-foreground'>
        Показано {paginatedOrders.length} из {totalCount} заказов
        {totalPagesCalculated > 1 && (
          <span className='ml-2'>
            (страница {currentPageNumber} из {totalPagesCalculated})
          </span>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleFirstPage}
          disabled={currentPageNumber === 1}
          className='h-8 px-2'
          title='В начало'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={handlePrevPage}
          disabled={!hasPrevious}
          className='h-8 px-3'
        >
          <ChevronLeft className='h-4 w-4 mr-1' />
          Назад
        </Button>

        <span className='text-sm text-muted-foreground px-2'>
          {totalPagesCalculated > 1 && `${currentPageNumber} / ${totalPagesCalculated}`}
        </span>

        <Button
          variant='outline'
          size='sm'
          onClick={handleNextPage}
          disabled={!hasNext}
          className='h-8 px-3'
        >
          Вперед
          <ChevronRight className='h-4 w-4 ml-1' />
        </Button>
      </div>
    </div>
  );
}
