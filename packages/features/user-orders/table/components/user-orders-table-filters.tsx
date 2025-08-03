'use client';

import { Search, Filter, Columns, ChevronDown, X, RefreshCw } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import { type OrderStatus, OrderStatusValues } from '@entities/orders/enums/OrderStatus.enum';
import { type OrderSubStatus, OrderSubStatusValues } from '@entities/orders/enums/OrderSubStatus.enum';
import { type OrderType, OrderTypeValues } from '@entities/orders/enums/OrderType.enum';
import { orderTypeLabels, orderStatusLabels, orderSubStatusLabels } from '@entities/orders';

interface ColumnVisibility {
  orderNumber: boolean;
  type: boolean;
  status: boolean;
  subStatus: boolean;
  initialPrice: boolean;
  finalPrice: boolean;
  createdAt: boolean;
  completedAt: boolean;
  scheduledTime: boolean;
  actions: boolean;
}

interface UserOrdersTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: OrderType[];
  handleTypeFilterChange: (types: OrderType[]) => void;
  statusFilter: OrderStatus[];
  handleStatusFilterChange: (statuses: OrderStatus[]) => void;
  subStatusFilter: OrderSubStatus[];
  handleSubStatusFilterChange: (subStatuses: OrderSubStatus[]) => void;
  pageSize: number;
  handlePageSizeChange: (size: number) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  columnVisibility: ColumnVisibility;
  handleColumnVisibilityChange: (column: keyof ColumnVisibility, visible: boolean) => void;
  totalCount: number;
  onRefresh: () => void;
}

export function UserOrdersTableFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  handleTypeFilterChange,
  statusFilter,
  handleStatusFilterChange,
  subStatusFilter,
  handleSubStatusFilterChange,
  pageSize,
  handlePageSizeChange,
  showAdvancedFilters,
  setShowAdvancedFilters,
  columnVisibility,
  handleColumnVisibilityChange,
  totalCount,
  onRefresh,
}: UserOrdersTableFiltersProps) {
  const handleTypeToggle = (type: OrderType) => {
    const newTypes = typeFilter.includes(type)
      ? typeFilter.filter(t => t !== type)
      : [...typeFilter, type];
    handleTypeFilterChange(newTypes);
  };

  const handleStatusToggle = (status: OrderStatus) => {
    const newStatuses = statusFilter.includes(status)
      ? statusFilter.filter(s => s !== status)
      : [...statusFilter, status];
    handleStatusFilterChange(newStatuses);
  };

  const handleSubStatusToggle = (subStatus: OrderSubStatus) => {
    const newSubStatuses = subStatusFilter.includes(subStatus)
      ? subStatusFilter.filter(s => s !== subStatus)
      : [...subStatusFilter, subStatus];
    handleSubStatusFilterChange(newSubStatuses);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    handleTypeFilterChange([]);
    handleStatusFilterChange([]);
    handleSubStatusFilterChange([]);
  };

  const activeFiltersCount = typeFilter.length + statusFilter.length + subStatusFilter.length + (searchTerm ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Основная строка с поиском и кнопками */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 items-center">
          {/* Поиск */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по номеру заказа..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Кнопка фильтров */}
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Фильтры
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </Button>

          {/* Очистить фильтры */}
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-2">
              <X className="h-4 w-4" />
              Очистить
            </Button>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {/* Размер страницы */}
          <div className="flex items-center gap-2">
            <Label htmlFor="pageSize" className="text-sm whitespace-nowrap">
              Показать:
            </Label>
            <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Управление колонками */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns className="h-4 w-4" />
                Колонки
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {Object.entries(columnVisibility).map(([column, visible]) => (
                <DropdownMenuItem key={column} className="flex items-center gap-2" asChild>
                  <label className="cursor-pointer">
                    <Checkbox
                      checked={visible}
                      onCheckedChange={(checked) =>
                        handleColumnVisibilityChange(column as keyof ColumnVisibility, !!checked)
                      }
                    />
                    <span className="capitalize">
                      {column === 'orderNumber' && 'Номер заказа'}
                      {column === 'type' && 'Тип'}
                      {column === 'status' && 'Статус'}
                      {column === 'subStatus' && 'Подстатус'}
                      {column === 'initialPrice' && 'Начальная цена'}
                      {column === 'finalPrice' && 'Итоговая цена'}
                      {column === 'createdAt' && 'Создан'}
                      {column === 'completedAt' && 'Завершен'}
                      {column === 'scheduledTime' && 'Запланирован'}
                      {column === 'actions' && 'Действия'}
                    </span>
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Кнопка обновить */}
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Обновить
          </Button>


        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          {/* Фильтр по типу */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Тип заказа</Label>
            <div className="space-y-2">
              {OrderTypeValues.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={typeFilter.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <span className="text-sm">{orderTypeLabels[type]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Фильтр по статусу */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Статус</Label>
            <div className="space-y-2">
              {OrderStatusValues.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <span className="text-sm">{orderStatusLabels[status]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Фильтр по подстатусу */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Подстатус</Label>
            <div className="space-y-2">
              {OrderSubStatusValues.map((subStatus) => (
                <label key={subStatus} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={subStatusFilter.includes(subStatus)}
                    onCheckedChange={() => handleSubStatusToggle(subStatus)}
                  />
                  <span className="text-sm">{orderSubStatusLabels[subStatus]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
