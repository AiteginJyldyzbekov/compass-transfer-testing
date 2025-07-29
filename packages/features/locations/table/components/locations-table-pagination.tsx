'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';

interface LocationsTablePaginationProps {
  paginatedLocations: LocationDTO[];
  filteredLocations: LocationDTO[];
  currentCursor: string | null;
  isFirstPage: boolean;
  currentPageNumber: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export function LocationsTablePagination({
  paginatedLocations,
  filteredLocations: _filteredLocations,
  currentCursor: _currentCursor,
  isFirstPage: _isFirstPage,
  currentPageNumber,
  totalPages: _totalPages,
  pageSize,
  totalCount,
  hasNext,
  hasPrevious,
  handleNextPage,
  handlePrevPage,
}: LocationsTablePaginationProps) {
  // Вычисляем общее количество страниц
  const totalPagesCalculated = Math.ceil(totalCount / pageSize);

  // Используем отслеживаемый номер страницы
  const currentPageDisplay = currentPageNumber;

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-sm text-muted-foreground'>
        Показано {paginatedLocations.length} из {totalCount} локаций
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
          {totalPagesCalculated > 1 && `${currentPageDisplay} / ${totalPagesCalculated}`}
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
