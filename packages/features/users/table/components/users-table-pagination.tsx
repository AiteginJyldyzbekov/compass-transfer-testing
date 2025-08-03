'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { type UserApi } from '@entities/users';

interface UsersTablePaginationProps {
  paginatedUsers: UserApi[];
  filteredUsers: UserApi[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  handlePageChange: (page: number) => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleFirstPage: () => void;
}

export function UsersTablePagination({
  paginatedUsers,
  filteredUsers: _filteredUsers,
  currentPage,
  totalPages,
  totalCount,
  hasNext,
  hasPrevious,
  handlePageChange: _handlePageChange,
  handleNextPage,
  handlePrevPage,
  handleFirstPage,
}: UsersTablePaginationProps) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-sm text-muted-foreground'>
        Показано {paginatedUsers.length} из {totalCount} пользователей
        {totalPages > 1 && (
          <span className='ml-2'>
            (страница {currentPage} из {totalPages})
          </span>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleFirstPage}
          disabled={currentPage === 1}
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
          {totalPages > 1 && `${currentPage} / ${totalPages}`}
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
