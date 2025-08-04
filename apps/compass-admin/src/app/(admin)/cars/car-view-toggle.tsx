'use client';

import { Table, LayoutGrid } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Tooltip } from '@pages/(admin)/dashboard/operator/components/tooltip';

interface CarViewToggleProps {
  defaultView: 'table' | 'cards';
  onViewChange: (view: 'table' | 'cards') => void;
}

export function CarViewToggle({ defaultView, onViewChange }: CarViewToggleProps) {
  return (
    <div className='flex items-center gap-1 border rounded-lg p-1 bg-gray-50'>
      <Tooltip content="Табличный вид" position="bottom">
        <Button
          variant={defaultView === 'table' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => onViewChange('table')}
          className='h-8 w-8 p-0'
        >
          <Table className='h-4 w-4' />
        </Button>
      </Tooltip>

      <Tooltip content="Карточки" position="bottom">
        <Button
          variant={defaultView === 'cards' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => onViewChange('cards')}
          className='h-8 w-8 p-0'
        >
          <LayoutGrid className='h-4 w-4' />
        </Button>
      </Tooltip>
    </div>
  );
}
