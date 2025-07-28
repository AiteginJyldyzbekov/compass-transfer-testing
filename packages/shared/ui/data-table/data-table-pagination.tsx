'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@shared/ui/forms/button';

export interface DataTablePaginationProps {
  currentItems: unknown[];
  totalItems: unknown[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemName?: string; // например: "пользователей", "заказов", "клиентов"
}

export function DataTablePagination({
  currentItems,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  itemName = 'элементов',
}: DataTablePaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => onPageChange(i)}
          className='min-w-[40px]'
        >
          {i}
        </Button>
      );
    }
    
    return pages;
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-muted-foreground'>
        Показано {currentItems.length} из {totalItems.length} {itemName} (страница{' '}
        {currentPage} из {totalPages})
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className='focus-visible:ring-0 focus:ring-0'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='focus-visible:ring-0 focus:ring-0'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        
        <div className='flex items-center gap-1'>
          {renderPageNumbers()}
        </div>
        
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='focus-visible:ring-0 focus:ring-0'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className='focus-visible:ring-0 focus:ring-0'
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
