'use client';

import { Table, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@shared/ui/forms/button';
import { SimpleTooltip } from '@shared/ui/modals/tooltip';

interface TariffViewToggleProps {
  onViewChange: (view: 'table' | 'cards') => void;
  defaultView?: 'table' | 'cards';
}

export function TariffViewToggle({ onViewChange, defaultView = 'table' }: TariffViewToggleProps) {
  const [currentView, setCurrentView] = useState<'table' | 'cards'>(defaultView);

  const handleViewChange = (view: 'table' | 'cards') => {
    setCurrentView(view);
    onViewChange(view);
  };

  return (
    <div className='flex items-center gap-1 border rounded-lg p-1'>
      <SimpleTooltip content="Табличный вид" variant='premium'>
        <Button
          variant={currentView === 'table' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => handleViewChange('table')}
          className='h-8 w-8 p-0'
        >
          <Table className='h-4 w-4' />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip content="Карточки" variant='premium'>
        <Button
          variant={currentView === 'cards' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => handleViewChange('cards')}
          className='h-8 w-8 p-0'
        >
          <LayoutGrid className='h-4 w-4' />
        </Button>
      </SimpleTooltip>
    </div>
  );
}
