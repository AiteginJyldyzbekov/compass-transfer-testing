'use client';

import { Table, LayoutGrid } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { SimpleTooltip } from '@shared/ui/modals/tooltip';

interface CarViewToggleProps {
  defaultView: 'table' | 'cards';
  onViewChange: (view: 'table' | 'cards') => void;
}

export function CarViewToggle({ defaultView, onViewChange }: CarViewToggleProps) {
  return (
    <div className='flex items-center gap-1 border rounded-lg p-1 bg-gray-50'>
      <SimpleTooltip content="Табличный вид"  variant='premium'>
        <Button
          variant={defaultView === 'table' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => onViewChange('table')}
          className='h-8 w-8 p-0'
        >
          <Table className='h-4 w-4' />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip content="Карточки" variant='premium'>
        <Button
          variant={defaultView === 'cards' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => onViewChange('cards')}
          className='h-8 w-8 p-0'
        >
          <LayoutGrid className='h-4 w-4' />
        </Button>
      </SimpleTooltip>
    </div>
  );
}
