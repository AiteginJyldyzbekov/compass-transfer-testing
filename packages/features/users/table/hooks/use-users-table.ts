'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { usersApi } from '@shared/api/users';
import {
  UserRole,
  type UserRoleType,
  type UserApi,
} from '@entities/users';

export function useUsersTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('fullName');
  const [sortOrder, setSortOrder] = useState<'Asc' | 'Desc'>('Asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');

  // Получаем роль из URL параметров
  const roleFromUrl = searchParams.get('role');
  const [roleFilter, setRoleFilter] = useState<UserRoleType | 'all'>(() => {
    if (roleFromUrl && Object.values(UserRole).includes(roleFromUrl as UserRoleType)) {
      return roleFromUrl as UserRoleType;
    }

    return 'all';
  });

  const [onlineFilter, setOnlineFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Инициализируем pageSize из localStorage синхронно
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPageSize = localStorage.getItem('users-page-size');

      if (savedPageSize) {
        const parsedSize = parseInt(savedPageSize, 10);

        if (!isNaN(parsedSize) && parsedSize > 0) {
          return parsedSize;
        }
      }
    }
    
    return 5; // значение по умолчанию
  });

  // Инициализируем columnVisibility из localStorage синхронно
  const [columnVisibility, setColumnVisibility] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('users-column-visibility');

      if (saved) {
        try {
          return JSON.parse(saved);

        } catch {
          // Fallback если JSON поврежден - используем значения по умолчанию
        }
      }
    }

    return {
      user: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      actions: true,
    };
  });

  // Функция загрузки пользователей
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Создаем параметры поиска
      const params: Record<string, string | number | undefined> = {
        role: roleFilter === 'all' ? undefined : roleFilter,
        page: currentPage,
        size: pageSize,
        sortBy,
        sortOrder,
      };

      // Добавляем поиск по имени (основной поиск)
      if (searchTerm) {
        params.fullName = searchTerm;
        params.fullNameOp = 'Contains';
      }

      // Добавляем фильтр по email
      if (emailFilter) {
        params.email = emailFilter;
        params.emailOp = 'Contains';
      }

      // Добавляем фильтр по телефону
      if (phoneFilter) {
        params.phoneNumber = phoneFilter;
        params.phoneNumberOp = 'Contains';
      }

      const response = await usersApi.getUsers(params);

      setUsers(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки пользователей';

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchTerm, emailFilter, phoneFilter, currentPage, pageSize, sortBy, sortOrder]);

  // Клиентская фильтрация только для онлайн статуса (если нужно)
  const filteredUsers = users.filter(user => {
    const matchesOnline =
      onlineFilter === 'all' ||
      (onlineFilter === 'online' && user.online) ||
      (onlineFilter === 'offline' && !user.online);

    return matchesOnline;
  });

  // Данные уже приходят с сервера с пагинацией
  const paginatedUsers = filteredUsers;
  const totalPages = Math.ceil(filteredUsers.length / pageSize); // Это нужно будет получать с сервера

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Сбрасываем на первую страницу

    if (typeof window !== 'undefined') {
      localStorage.setItem('users-page-size', newPageSize.toString());
    }
  };

  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    const newVisibility = { ...columnVisibility, [column]: visible };

    setColumnVisibility(newVisibility);

    if (typeof window !== 'undefined') {
      localStorage.setItem('users-column-visibility', JSON.stringify(newVisibility));
    }
  };

  // Обработка изменений фильтра роли с обновлением URL
  const handleRoleFilterChange = (value: UserRoleType | 'all') => {
    setRoleFilter(value);
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete('role');
    } else {
      params.set('role', value);
    }

    router.push(`/users?${params.toString()}`);
  };

  // Обработчик сортировки
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Если кликнули по тому же полю, меняем направление
      setSortOrder(sortOrder === 'Asc' ? 'Desc' : 'Asc');
    } else {
      // Если кликнули по новому полю, устанавливаем его и направление по возрастанию
      setSortBy(field);
      setSortOrder('Asc');
    }
  };

  // Синхронизация roleFilter с URL параметрами
  useEffect(() => {
    const currentRoleFromUrl = searchParams.get('role');

    if (
      currentRoleFromUrl &&
      Object.values(UserRole).includes(currentRoleFromUrl as UserRoleType)
    ) {
      setRoleFilter(currentRoleFromUrl as UserRoleType);
    } else if (!currentRoleFromUrl) {
      setRoleFilter('all');
    }
  }, [searchParams]);



  // Загрузка пользователей при изменении фильтров
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    // Data
    users,
    filteredUsers,
    paginatedUsers,

    // State
    loading,
    error,
    searchTerm,
    emailFilter,
    phoneFilter,
    roleFilter,
    onlineFilter,
    showAdvancedFilters,
    currentPage,
    pageSize,
    columnVisibility,
    totalPages,
    sortBy,
    sortOrder,

    // Handlers
    setSearchTerm,
    setEmailFilter,
    setPhoneFilter,
    setOnlineFilter,
    setShowAdvancedFilters,
    handlePageChange,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleRoleFilterChange,
    handleSort,
    loadUsers,

    // Router
    router,
  };
}
