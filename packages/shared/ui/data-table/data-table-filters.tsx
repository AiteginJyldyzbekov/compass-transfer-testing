'use client';

import { Search, Filter, Columns, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@shared/ui/forms/button';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';

export interface DataTableFiltersProps {
  // Поиск
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // Размер страницы
  pageSize?: number;
  onPageSizeChange?: (value: number) => void;
  pageSizeOptions?: number[];
  
  // Расширенные фильтры
  showAdvancedFilters?: boolean;
  onToggleAdvancedFilters?: (value: boolean) => void;
  advancedFiltersContent?: ReactNode;
  
  // Видимость колонок
  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (column: string, visible: boolean) => void;
  columnLabels?: Record<string, string>;
  
  // Дополнительные фильтры справа
  rightContent?: ReactNode;
}

export function DataTableFilters({
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Поиск...',
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showAdvancedFilters = false,
  onToggleAdvancedFilters,
  advancedFiltersContent,
  columnVisibility = {},
  onColumnVisibilityChange,
  columnLabels = {},
  rightContent,
}: DataTableFiltersProps) {
  return (
    <div className='space-y-4'>
      {/* Основная строка фильтров */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 items-center gap-4'>
          {/* Поиск */}
          {onSearchChange && (
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className='pl-9 focus-visible:ring-0 focus:ring-0'
              />
            </div>
          )}
          
          {/* Размер страницы */}
          {onPageSizeChange && (
            <div className='flex items-center gap-2'>
              <Label htmlFor='page-size' className='text-sm whitespace-nowrap'>
                Показать:
              </Label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger id='page-size' className='w-20 focus:ring-0'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className='flex items-center gap-2'>
          {rightContent}
          
          {/* Расширенные фильтры */}
          {onToggleAdvancedFilters && advancedFiltersContent && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => onToggleAdvancedFilters(!showAdvancedFilters)}
              className='focus-visible:ring-0 focus:ring-0'
            >
              <Filter className='mr-2 h-4 w-4' />
              Фильтры
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </Button>
          )}
          
          {/* Видимость колонок */}
          {onColumnVisibilityChange && Object.keys(columnVisibility).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='focus-visible:ring-0 focus:ring-0'
                >
                  <Columns className='mr-2 h-4 w-4' />
                  Колонки
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                {Object.entries(columnVisibility).map(([key, visible]) => (
                  <DropdownMenuItem
                    key={key}
                    className='flex items-center gap-2 cursor-pointer'
                    onClick={(e) => {
                      e.preventDefault();
                      onColumnVisibilityChange(key, !visible);
                    }}
                  >
                    <Checkbox
                      checked={visible}
                      onCheckedChange={(checked) => onColumnVisibilityChange(key, !!checked)}
                      className='pointer-events-none'
                    />
                    <span>{columnLabels[key] || key}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Расширенные фильтры */}
      {showAdvancedFilters && advancedFiltersContent && (
        <div className='rounded-lg border p-4'>
          {advancedFiltersContent}
        </div>
      )}
    </div>
  );
}
