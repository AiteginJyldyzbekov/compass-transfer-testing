'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import type { GetCarDTO } from '@entities/cars/interface';

interface CarsTablePaginationProps {
  paginatedCars: GetCarDTO[];
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPageNumber: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export function CarsTablePagination({
  paginatedCars,
  totalCount,
  pageSize,
  hasNext,
  hasPrevious,
  currentPageNumber,
  handleNextPage,
  handlePrevPage,
}: CarsTablePaginationProps) {
  const startItem = (currentPageNumber - 1) * pageSize + 1;
  const endItem = Math.min(currentPageNumber * pageSize, totalCount);

  if (!hasNext && !hasPrevious) {
    return (
      <div className='flex items-center justify-between px-2'>
        <div className='text-sm text-muted-foreground'>
          Показано {paginatedCars.length} из {totalCount} автомобилей
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-sm text-muted-foreground'>
        Показано {startItem}-{endItem} из {totalCount} автомобилей
      </div>

      <div className='flex items-center space-x-2'>
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
          Страница {currentPageNumber}
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
