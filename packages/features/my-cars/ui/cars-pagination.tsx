import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GetMyCarParams } from '@shared/api/cars';
import { Button } from '@shared/ui/forms/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';

interface CarsPaginationProps {
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  currentFilters: GetMyCarParams;
  onFiltersChange: (filters: GetMyCarParams) => void;
}

export function CarsPagination({
  totalCount,
  pageSize,
  hasPrevious,
  hasNext,
  currentFilters,
  onFiltersChange,
}: CarsPaginationProps) {
  const handlePreviousPage = () => {
    if (hasPrevious) {
      onFiltersChange({
        ...currentFilters,
        Before: currentFilters.After,
        After: undefined,
        First: undefined,
        Last: pageSize,
      });
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      onFiltersChange({
        ...currentFilters,
        After: currentFilters.Before,
        Before: undefined,
        First: pageSize,
        Last: undefined,
      });
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = Number(newSize);
    
    onFiltersChange({
      ...currentFilters,
      Size: size,
      First: size,
      Last: undefined,
      Before: undefined,
      After: undefined,
    });
  };

  const currentPage = Math.floor((currentFilters.First || 0) / pageSize) + 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <span>Показано {Math.min(pageSize, totalCount)} из {totalCount} автомобилей</span>
      </div>

      <div className='flex items-center gap-4'>
        {/* Размер страницы */}
        <div className='flex items-center gap-2'>
          <span className='text-sm'>Показать:</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Навигация */}
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePreviousPage}
            disabled={!hasPrevious}
          >
            <ChevronLeft className='h-4 w-4' />
            Назад
          </Button>

          <span className='text-sm px-2'>
            Страница {currentPage} из {totalPages}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={handleNextPage}
            disabled={!hasNext}
          >
            Вперед
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
