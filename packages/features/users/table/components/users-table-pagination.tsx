'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { type UserApi } from '@entities/users';

interface UsersTablePaginationProps {
  paginatedUsers: UserApi[];
  filteredUsers: UserApi[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export function UsersTablePagination({
  paginatedUsers,
  filteredUsers,
  currentPage,
  totalPages,
  handlePageChange,
}: UsersTablePaginationProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-muted-foreground'>
        Показано {paginatedUsers.length} из {filteredUsers.length} пользователей (страница{' '}
        {currentPage} из {totalPages})
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <div className='flex items-center gap-1'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size='sm'
              className='h-8 w-8'
              onClick={() => handlePageChange(page)}
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
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
