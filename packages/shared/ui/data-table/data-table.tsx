'use client';

import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  visible: boolean;
  width?: string;
  render: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (column: string, visible: boolean) => void;
  getItemKey: (item: T) => string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  columnVisibility,
  onColumnVisibilityChange: _onColumnVisibilityChange,
  getItemKey,
  className = '',
}: DataTableProps<T>) {
  const filteredColumns = columns.filter(column => columnVisibility[column.key]);

  return (
    <div className={`rounded-md border ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {filteredColumns.map(column => (
              <th
                key={column.key}
                className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${column.width || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={getItemKey(item)} className="border-b transition-colors hover:bg-muted/50">
              {filteredColumns.map(column => (
                <td key={column.key} className="p-4 align-middle">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
