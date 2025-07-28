'use client';

import type { ReactNode } from 'react';
import { DataTable, type DataTableColumn } from './data-table';
import { DataTableFilters, type DataTableFiltersProps } from './data-table-filters';
import { DataTablePagination, type DataTablePaginationProps } from './data-table-pagination';

export interface DataTableContainerProps<T> {
  // Данные
  data: T[]; // Текущие отображаемые данные (с учетом пагинации)
  totalData?: T[]; // Все данные (для пагинации)
  columns: DataTableColumn<T>[];
  getItemKey: (item: T) => string;
  
  // Фильтры
  filtersProps?: DataTableFiltersProps;
  
  // Пагинация
  paginationProps?: Omit<DataTablePaginationProps, 'currentItems' | 'totalItems'>;
  
  // Видимость колонок
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (column: string, visible: boolean) => void;
  
  // Стили
  className?: string;
  
  // Заголовок и дополнительный контент
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
}

export function DataTableContainer<T>({
  data,
  totalData,
  columns,
  getItemKey,
  filtersProps,
  paginationProps,
  columnVisibility,
  onColumnVisibilityChange,
  className = '',
  title,
  subtitle,
  headerActions,
}: DataTableContainerProps<T>) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Заголовок */}
      {(title || subtitle || headerActions) && (
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          {(title || subtitle) && (
            <div className='flex flex-col gap-2'>
              {title && <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>}
              {subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
            </div>
          )}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      
      {/* Фильтры */}
      {filtersProps && (
        <DataTableFilters
          {...filtersProps}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
        />
      )}
      
      {/* Таблица */}
      <DataTable
        data={data}
        columns={columns}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={onColumnVisibilityChange}
        getItemKey={getItemKey}
      />
      
      {/* Пагинация */}
      {paginationProps && (
        <DataTablePagination
          {...paginationProps}
          currentItems={data}
          totalItems={totalData || data}
        />
      )}
    </div>
  );
}
