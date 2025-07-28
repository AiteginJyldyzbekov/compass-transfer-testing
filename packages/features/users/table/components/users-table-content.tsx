'use client';

import { MoreHorizontal, Edit, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/data-display/avatar';
import { Badge } from '@shared/ui/data-display/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/ui/data-display/table';
import { Button } from '@shared/ui/forms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import { UserRole, type UserApi, getRoleDisplayName, getRoleColor, getInitials } from '@entities/users';

interface Router {
  push: (url: string) => void;
}

interface UsersTableContentProps {
  paginatedUsers: UserApi[];
  columnVisibility: Record<string, boolean>;
  router: Router;
  sortBy: string;
  sortOrder: 'Asc' | 'Desc';
  handleSort: (field: string) => void;
  onDeleteUser: (user: UserApi) => void;
}

// Компонент для сортируемого заголовка
function SortableHeader({
  field,
  children,
  sortBy,
  sortOrder,
  onSort
}: {
  field: string;
  children: React.ReactNode;
  sortBy: string;
  sortOrder: 'Asc' | 'Desc';
  onSort: (field: string) => void;
}) {
  const isActive = sortBy === field;

  return (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {isActive && (
          sortOrder === 'Asc' ?
            <ChevronUp className="h-4 w-4" /> :
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );
}

export function UsersTableContent({
  paginatedUsers,
  columnVisibility,
  router,
  sortBy,
  sortOrder,
  handleSort,
  onDeleteUser,
}: UsersTableContentProps) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.user && (
              <SortableHeader field="fullName" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                Пользователь
              </SortableHeader>
            )}
            {columnVisibility.email && (
              <SortableHeader field="email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                Email
              </SortableHeader>
            )}
            {columnVisibility.phone && (
              <SortableHeader field="phoneNumber" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                Телефон
              </SortableHeader>
            )}
            {columnVisibility.role && (
              <SortableHeader field="role" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                Роль
              </SortableHeader>
            )}
            {columnVisibility.status && (
              <SortableHeader field="online" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>
                Статус
              </SortableHeader>
            )}
            {columnVisibility.actions && <TableHead className='w-[50px]' />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map(user => (
            <TableRow key={user.id}>
              {columnVisibility.user && (
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user.avatarUrl ?? ''} alt={user.fullName} />
                      <AvatarFallback className='text-xs'>
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-medium'>{user.fullName}</div>
                    </div>
                  </div>
                </TableCell>
              )}
              {columnVisibility.email && (
                <TableCell className='font-mono text-sm'>{user.email}</TableCell>
              )}
              {columnVisibility.phone && <TableCell>{user.phoneNumber || '-'}</TableCell>}
              {columnVisibility.role && (
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>{getRoleDisplayName(user.role)}</Badge>
                </TableCell>
              )}
              {columnVisibility.status && (
                <TableCell>
                  <Badge variant={user.online ? 'default' : 'secondary'}>
                    {user.online ? 'Онлайн' : 'Оффлайн'}
                  </Badge>
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
                      <DropdownMenuItem onClick={() => {
                        // Правильная обработка ролей для URL просмотра
                        const rolePath = user.role === UserRole.Terminal ? 'terminal' : user.role.toLowerCase();
                        const viewPath = `/users/${rolePath}/${user.id}`;
                        
                        router.push(viewPath);
                      }}>
                        <Eye className='mr-2 h-4 w-4' />
                        Просмотр
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // Правильная обработка ролей для URL редактирования
                          const rolePath = user.role === UserRole.Terminal ? 'terminal' : user.role.toLowerCase();
                          const editPath = `/users/edit/${rolePath}/${user.id}`;
                          
                          router.push(editPath);
                        }}
                      >
                        <Edit className='mr-2 h-4 w-4' />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-red-600'
                        onClick={() => onDeleteUser(user)}
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
