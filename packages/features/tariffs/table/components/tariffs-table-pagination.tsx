'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GetTariffDTOWithArchived } from '@shared/api/tariffs';
import { Button } from '@shared/ui/forms/button';

interface TariffsTablePaginationProps {
  paginatedTariffs: GetTariffDTOWithArchived[];
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPageNumber: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export function TariffsTablePagination({
  paginatedTariffs,
  totalCount,
  pageSize,
  hasNext,
  hasPrevious,
  currentPageNumber,
  handleNextPage,
  handlePrevPage,
}: TariffsTablePaginationProps) {
  // Вычисляем общее количество страниц
  const totalPagesCalculated = Math.ceil(totalCount / pageSize);

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-sm text-muted-foreground'>
        Показано {paginatedTariffs.length} из {totalCount} тарифов
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
