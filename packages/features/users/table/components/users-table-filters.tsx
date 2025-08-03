'use client';

import { Search, Filter, Columns, ChevronDown } from 'lucide-react';
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
import { UserRole, type UserRoleType } from '@entities/users';

interface UsersTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  emailFilter: string;
  setEmailFilter: (value: string) => void;
  phoneFilter: string;
  setPhoneFilter: (value: string) => void;
  roleFilter: UserRoleType | 'all';
  handleRoleFilterChange: (value: UserRoleType | 'all') => void;
  onlineFilter: 'all' | 'online' | 'offline';
  setOnlineFilter: (value: 'all' | 'online' | 'offline') => void;
  pageSize: number;
  handlePageSizeChange: (value: number) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  columnVisibility: Record<string, boolean>;
  handleColumnVisibilityChange: (column: string, visible: boolean) => void;
}

export function UsersTableFilters({
  searchTerm,
  setSearchTerm,
  emailFilter,
  setEmailFilter,
  phoneFilter,
  setPhoneFilter,
  roleFilter,
  handleRoleFilterChange,
  onlineFilter,
  setOnlineFilter,
  pageSize,
  handlePageSizeChange,
  showAdvancedFilters,
  setShowAdvancedFilters,
  columnVisibility,
  handleColumnVisibilityChange,
}: UsersTableFiltersProps) {
  return (
    <>
      {/* Основные фильтры */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between overflow-x-auto py-2'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Поиск по имени, email или телефону...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10 w-full md:w-80'
            />
          </div>

          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className='w-full md:w-40'>
              <SelectValue placeholder='Роль' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Все роли</SelectItem>
              <SelectItem value={UserRole.Admin}>Администратор</SelectItem>
              <SelectItem value={UserRole.Operator}>Оператор</SelectItem>
              <SelectItem value={UserRole.Driver}>Водитель</SelectItem>
              <SelectItem value={UserRole.Customer}>Клиент</SelectItem>
              <SelectItem value={UserRole.Partner}>Контр-агент</SelectItem>
              <SelectItem value={UserRole.Terminal}>Терминал</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={onlineFilter}
            onValueChange={value => setOnlineFilter(value as 'all' | 'online' | 'offline')}
          >
            <SelectTrigger className='w-full md:w-40'>
              <SelectValue placeholder='Статус' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Все</SelectItem>
              <SelectItem value='online'>Онлайн</SelectItem>
              <SelectItem value='offline'>Оффлайн</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={pageSize.toString()}
            onValueChange={value => handlePageSizeChange(parseInt(value, 10))}
          >
            <SelectTrigger className='w-full md:w-32'>
              <SelectValue placeholder='Размер' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-2 pr-4'>
          <Button
            variant={showAdvancedFilters ? 'default' : 'outline'}
            className='w-full md:w-auto'
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className='mr-2 h-4 w-4' />
            Фильтры
          </Button>
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvancedFilters && (
        <div className='rounded-lg border bg-card p-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Фильтры</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                >
                  <Columns className='mr-2 h-4 w-4' />
                  Настроить колонки
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-48'>
                {[
                  { key: 'user', label: 'Пользователь' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Телефон' },
                  { key: 'role', label: 'Роль' },
                  { key: 'status', label: 'Статус' },
                  { key: 'actions', label: 'Действия' },
                ].map(column => (
                  <DropdownMenuItem
                    key={column.key}
                    className='flex items-center space-x-2 cursor-pointer'
                    onSelect={e => {
                      e.preventDefault();
                      handleColumnVisibilityChange(
                        column.key,
                        !columnVisibility[column.key as keyof typeof columnVisibility],
                      );
                    }}
                  >
                    <Checkbox
                      checked={columnVisibility[column.key as keyof typeof columnVisibility]}
                      className='pointer-events-none'
                    />
                    <span className='text-sm'>{column.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='email-filter'>Email</Label>
              <Input
                id='email-filter'
                placeholder='Фильтр по email'
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className='hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow'
              />
            </div>
            <div>
              <Label htmlFor='phone-filter'>Телефон</Label>
              <Input
                id='phone-filter'
                placeholder='Фильтр по телефону'
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                className='hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow'
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
