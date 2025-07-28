'use client';

import { ArrowUpDown, Edit, Trash2, Hash, CheckCircle, XCircle, ChevronUp, ChevronDown, MoreHorizontal, Eye } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Button } from '@shared/ui/forms/button';
import { Badge } from '@shared/ui/data-display/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/data-display/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import type { GetServiceDTO } from '@entities/services/interface/GetServiceDTO';

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  price: boolean;
  isQuantifiable: boolean;
  actions: boolean;
}

interface ServicesTableContentProps {
  paginatedServices: GetServiceDTO[];
  columnVisibility: ColumnVisibility;
  router: AppRouterInstance;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: string) => void;
  onDeleteService: (service: GetServiceDTO) => void;
}

// Компонент для сортируемых заголовков
interface SortableHeaderProps {
  field: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  children: React.ReactNode;
}

function SortableHeader({ field, sortBy, sortOrder, onSort, children }: SortableHeaderProps) {
  const isActive = sortBy === field;

  return (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {isActive && (
          sortOrder === 'asc' ?
            <ChevronUp className="h-4 w-4" /> :
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );
}

export function ServicesTableContent({
  paginatedServices,
  columnVisibility,
  router,
  sortBy,
  sortOrder,
  handleSort,
  onDeleteService,
}: ServicesTableContentProps) {


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (paginatedServices.length === 0) {
    return;
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.name && <SortableHeader field='name' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Название</SortableHeader>}
            {columnVisibility.description && <SortableHeader field='description' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Описание</SortableHeader>}
            {columnVisibility.price && <SortableHeader field='price' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Цена</SortableHeader>}
            {columnVisibility.isQuantifiable && <SortableHeader field='isQuantifiable' sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Тип</SortableHeader>}
            {columnVisibility.actions && <TableHead className='w-[100px]'>Действия</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedServices.map((service) => (
            <TableRow key={service.id} className='hover:bg-muted/50'>
              {columnVisibility.name && (
                <TableCell className='font-medium'>{service.name}</TableCell>
              )}
              {columnVisibility.description && (
                <TableCell className='max-w-xs'>
                  {service.description ? (
                    <span className='text-sm text-muted-foreground' title={service.description}>
                      {service.description.length > 100 
                        ? `${service.description.substring(0, 100)}...` 
                        : service.description
                      }
                    </span>
                  ) : (
                    <span className='text-muted-foreground italic'>—</span>
                  )}
                </TableCell>
              )}
              {columnVisibility.price && (
                <TableCell>
                  <span className='font-mono font-semibold'>{formatPrice(service.price)}</span>
                </TableCell>
              )}
              {columnVisibility.isQuantifiable && (
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {service.isQuantifiable ? (
                      <>
                        <Hash className='h-4 w-4 text-blue-600' />
                        <Badge className='bg-blue-100 text-blue-800'>
                          Количественная
                        </Badge>
                      </>
                    ) : (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <Badge className='bg-green-100 text-green-800'>
                          Фиксированная
                        </Badge>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
              {columnVisibility.actions && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0 focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => router.push(`/services/${service.id}`)}>
                        <Eye className='mr-2 h-4 w-4' />
                        Просмотр
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/services/edit/${service.id}`)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-red-600'
                        onClick={() => onDeleteService(service)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
