'use client';

import { Search, Filter, Columns, ChevronDown, User, X, Save } from 'lucide-react';
import type { OrderType } from '@shared/api/notifications';
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
import { type NotificationType, NotificationTypeValues, getNotificationTypeLabel } from '@entities/notifications';

interface ColumnVisibility {
  type: boolean;
  title: boolean;
  content: boolean;
  orderId: boolean;
  rideId: boolean;
  orderType: boolean;
  isRead: boolean;
  createdAt: boolean;
  actions: boolean;
}

interface NotificationsTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  contentFilter: string;
  setContentFilter: (content: string) => void;
  typeFilter: NotificationType[];
  handleTypeFilterChange: (types: NotificationType[]) => void;
  orderTypeFilter: OrderType[];
  handleOrderTypeFilterChange: (orderTypes: OrderType[]) => void;
  isReadFilter: boolean | null;
  setIsReadFilter: (isRead: boolean | null) => void;
  userIdFilter: string;
  setUserIdFilter: (userId: string) => void;
  pageSize: number;
  handlePageSizeChange: (size: number) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  columnVisibility: ColumnVisibility;
  handleColumnVisibilityChange: (column: keyof ColumnVisibility, visible: boolean) => void;
  onShowMyNotifications: () => void;
  showMyNotifications: boolean;
  isUpdating: boolean;
  onSaveFilters?: () => void;
  onClearSavedFilters?: () => void;
  hasSavedFilters?: boolean;
  justSavedFilters?: boolean;
}



// Переводы для типов заказов
const orderTypeLabels: Record<OrderType, string> = {
  'Unknown': 'Неизвестно',
  'Instant': 'Мгновенный',
  'Scheduled': 'Запланированный',
  'Partner': 'Партнерский',
  'Shuttle': 'Шаттл',
  'Subscription': 'Подписка',
};

const orderTypes: OrderType[] = ['Unknown', 'Instant', 'Scheduled', 'Partner', 'Shuttle', 'Subscription'];

export function NotificationsTableFilters({
  searchTerm,
  setSearchTerm,
  contentFilter,
  setContentFilter,
  typeFilter,
  handleTypeFilterChange,
  orderTypeFilter,
  handleOrderTypeFilterChange,
  isReadFilter,
  setIsReadFilter,
  userIdFilter,
  setUserIdFilter,
  pageSize,
  handlePageSizeChange,
  showAdvancedFilters,
  setShowAdvancedFilters,
  columnVisibility,
  handleColumnVisibilityChange,
  onShowMyNotifications,
  showMyNotifications,
  isUpdating,
  onSaveFilters,
  onClearSavedFilters,
  hasSavedFilters,
  justSavedFilters,
}: NotificationsTableFiltersProps) {
  const handleTypeChange = (type: NotificationType, checked: boolean) => {
    if (checked) {
      handleTypeFilterChange([...typeFilter, type]);
    } else {
      handleTypeFilterChange(typeFilter.filter(t => t !== type));
    }
  };

  const handleOrderTypeChange = (orderType: OrderType, checked: boolean) => {
    if (checked) {
      handleOrderTypeFilterChange([...orderTypeFilter, orderType]);
    } else {
      handleOrderTypeFilterChange(orderTypeFilter.filter(ot => ot !== orderType));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setContentFilter('');
    handleTypeFilterChange([]);
    handleOrderTypeFilterChange([]);
    setUserIdFilter('');
  };

  const activeFiltersCount = [
    contentFilter,
    userIdFilter,
  ].filter(Boolean).length +
  typeFilter.length +
  orderTypeFilter.length;

  return (
    <>
      {/* Основные фильтры */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between overflow-x-auto py-2'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Поиск уведомлений...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 w-full md:w-80'
            />
          </div>

          <Select
            value={isReadFilter === null ? 'all' : isReadFilter.toString()}
            onValueChange={(value) => setIsReadFilter(value === 'all' ? null : value === 'true')}
          >
            <SelectTrigger className='w-full md:w-40'>
              <SelectValue placeholder='Статус' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Все</SelectItem>
              <SelectItem value='false'>Непрочитанные</SelectItem>
              <SelectItem value='true'>Прочитанные</SelectItem>
            </SelectContent>
          </Select>

          <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
            <SelectTrigger className='w-full md:w-32'>
              <SelectValue placeholder='Размер' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='25'>25</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-2 pr-4'>
          <div className='relative'>
            <Button
              variant={showAdvancedFilters ? 'default' : 'outline'}
              className='w-full md:w-auto'
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className='mr-2 h-4 w-4' />
              Фильтры
              {activeFiltersCount > 0 && (
                <Badge variant='secondary' className='ml-1'>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='absolute -top-2 -right-2 h-5 w-5 p-0 bg-white border border-gray-300 rounded-full hover:scale-105 transition-transform'
              >
                <X className='h-3 w-3 text-red-500' />
              </Button>
            )}
          </div>

          <Button
            variant={showMyNotifications ? 'default' : 'outline'}
            onClick={onShowMyNotifications}
            disabled={isUpdating}
            className='w-full md:w-auto flex items-center gap-2'
          >
            <User className='h-4 w-4' />
            {showMyNotifications ? 'Все уведомления' : 'Мои уведомления'}
          </Button>
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvancedFilters && (
        <div className='rounded-lg border bg-card p-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Фильтры</h3>
            <div className='flex items-center gap-2'>
              {onSaveFilters && (
                <div className='flex items-center gap-3'>
                  {/* Текст-индикатор состояния */}
                  <span className={`text-sm font-medium ${
                    justSavedFilters ? 'text-green-600' :
                    hasSavedFilters ? 'text-blue-600' :
                    'text-gray-500'
                  }`}>
                    {justSavedFilters ? 'Сохранено!' : hasSavedFilters ? 'Запоминание Фильтров включено' : 'Запоминание фильтров отключено'}
                  </span>

                  {/* Кнопка действия */}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={hasSavedFilters ? onClearSavedFilters : onSaveFilters}
                    title={hasSavedFilters ? 'Отключить автоматические фильтры' : 'Включить автоматическое применение фильтров'}
                    className={`h-8 w-8 p-0 transition-all duration-200 ${
                      hasSavedFilters ? 'text-red-500 hover:text-red-600 hover:bg-red-50' :
                      'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {hasSavedFilters ? (
                      <X className='h-4 w-4' />
                    ) : (
                      <Save className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              )}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Columns className='mr-2 h-4 w-4' />
                  Настроить колонки
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-48'>
                {[
                  { key: 'type', label: 'Тип' },
                  { key: 'content', label: 'Содержимое' },
                  { key: 'orderType', label: 'Тип заказа' },
                  { key: 'isRead', label: 'Прочитано' },
                  { key: 'actions', label: 'Действия' },
                ].map(column => (
                  <DropdownMenuItem
                    key={column.key}
                    className='flex items-center space-x-2 cursor-pointer'
                    onSelect={e => {
                      e.preventDefault();
                      handleColumnVisibilityChange(
                        column.key as keyof ColumnVisibility,
                        !columnVisibility[column.key as keyof ColumnVisibility],
                      );
                    }}
                  >
                    <Checkbox
                      checked={columnVisibility[column.key as keyof ColumnVisibility]}
                      className='pointer-events-none'
                    />
                    <span className='text-sm'>{column.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            <div>
              <Label htmlFor='content'>Содержимое</Label>
              <Input
                id='content'
                placeholder='Введите текст...'
                value={contentFilter}
                onChange={(e) => setContentFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='userId'>ID пользователя</Label>
              <Input
                id='userId'
                placeholder='Введите ID пользователя...'
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
              />
            </div>


          </div>

          {/* Фильтры с чекбоксами */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Типы уведомлений */}
            <div>
              <Label className='text-sm font-medium'>Тип уведомления</Label>
              <div className='mt-2 space-y-2 max-h-40 overflow-y-auto'>
                {NotificationTypeValues.map((type) => (
                  <div key={type} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`type-${type}`}
                      checked={typeFilter.includes(type)}
                      onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
                    />
                    <Label htmlFor={`type-${type}`} className='text-sm'>
                      {getNotificationTypeLabel(type)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Типы заказов */}
            <div>
              <Label className='text-sm font-medium'>Тип заказа</Label>
              <div className='mt-2 space-y-2'>
                {orderTypes.map((orderType) => (
                  <div key={orderType} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`orderType-${orderType}`}
                      checked={orderTypeFilter.includes(orderType)}
                      onCheckedChange={(checked) => handleOrderTypeChange(orderType, !!checked)}
                    />
                    <Label htmlFor={`orderType-${orderType}`} className='text-sm'>
                      {orderTypeLabels[orderType]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
