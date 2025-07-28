'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';

interface LocationsTablePaginationProps {
  paginatedLocations: LocationDTO[];
  filteredLocations: LocationDTO[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export function LocationsTablePagination({
  paginatedLocations,
  filteredLocations,
  currentPage,
  totalPages,
  handlePageChange,
}: LocationsTablePaginationProps) {
  const startItem = (currentPage - 1) * paginatedLocations.length + 1;
  const endItem = Math.min(currentPage * paginatedLocations.length, filteredLocations.length);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return (
      <div className='flex items-center justify-between px-2'>
        <div className='text-sm text-muted-foreground'>
          Показано {paginatedLocations.length} из {filteredLocations.length} локаций
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-sm text-muted-foreground'>
        Показано {startItem}-{endItem} из {filteredLocations.length} локаций
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className='h-8 w-8 p-0'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='h-8 w-8 p-0'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        <div className='flex items-center space-x-1'>
          {getVisiblePages().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? 'default' : 'outline'}
              size='sm'
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={typeof page !== 'number'}
              className='h-8 w-8 p-0'
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='h-8 w-8 p-0'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className='h-8 w-8 p-0'
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
