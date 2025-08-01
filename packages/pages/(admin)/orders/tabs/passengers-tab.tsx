'use client';

import { Users, Plus, Trash2, User, Phone, Mail, Search, UserCheck, MapPin, ExternalLink } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { usersApi } from '@shared/api/users';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { CarType, CarTypeValues } from '@entities/tariffs/enums/CarType.enum';

// Маппинг вместимости по типам автомобилей
const CAR_TYPE_CAPACITY: Record<CarType, number> = {
  [CarType.Sedan]: 4,
  [CarType.Hatchback]: 4,
  [CarType.SUV]: 5,
  [CarType.Minivan]: 8,
  [CarType.Coupe]: 2,
  [CarType.Cargo]: 2,
  [CarType.Pickup]: 3,
};

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  age?: number;
  isMainPassenger: boolean;
  isFromSystem?: boolean; // Пассажир из системы (нередактируемый)
  customerId?: string | null; // ID пользователя в системе
}

// Расширенный пассажир с загруженными данными пользователя
interface EnhancedPassenger extends Passenger {
  userData?: User | null; // Загруженные данные пользователя
  isUserDataLoaded?: boolean; // Флаг загрузки данных пользователя
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  phoneNumber?: string | null;
  email?: string;
  role: string;
  loyaltyPoints?: number;
  phantom?: boolean;
  profile?: {
    companyName?: string;
    companyType?: string;
    legalAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
    website?: string;
  };
}

interface SelectedTariff {
  id: string;
  carType: CarType;
  name?: string;
}

interface PassengersTabProps {
  users: User[];
  passengers?: Passenger[];
  handlePassengersChange?: (passengers: Passenger[]) => void;
  selectedTariff?: SelectedTariff; // Выбранный тариф для определения вместимости
  [key: string]: unknown;
}

export function PassengersTab({ users, passengers: initialPassengers, handlePassengersChange, selectedTariff }: PassengersTabProps) {
  const [passengers, setPassengers] = useState<EnhancedPassenger[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [isLoadingPassengerData, setIsLoadingPassengerData] = useState(false);
  const [passengersDataLoaded, setPassengersDataLoaded] = useState(false);

  // Функция для загрузки данных пользователя по ID
  const loadUserData = async (userId: string): Promise<User | null> => {
    try {
      const response = await usersApi.getUserById(userId);

      return response;
    } catch {
      return null;
    }
  };

  // useLayoutEffect для синхронной загрузки данных пассажиров
  useLayoutEffect(() => {
    const loadPassengersData = async () => {
      if (!initialPassengers || initialPassengers.length === 0) {
        setPassengersDataLoaded(true);
        
        return;
      }

      setIsLoadingPassengerData(true);

      const enhancedPassengers: EnhancedPassenger[] = [];

      for (const passenger of initialPassengers) {
        const enhancedPassenger: EnhancedPassenger = {
          ...passenger,
          userData: null,
          isUserDataLoaded: false
        };

        // Если у пассажира есть ID, это ID пользователя в системе - загружаем данные
        if (passenger.id) {
          const userData = await loadUserData(passenger.id);

          enhancedPassenger.userData = userData;
          enhancedPassenger.isUserDataLoaded = true;
        } else {
          // Если нет ID, помечаем как загруженный
          enhancedPassenger.isUserDataLoaded = true;
        }

        enhancedPassengers.push(enhancedPassenger);
      }

      setPassengers(enhancedPassengers);
      setIsLoadingPassengerData(false);
      setPassengersDataLoaded(true);
    };

    if (!passengersDataLoaded) {
      loadPassengersData();
    }
  }, [initialPassengers, passengersDataLoaded]);

  // Синхронизируем состояние пассажиров с пропсами при возврате на таб (старый useEffect)
  useEffect(() => {
    if (initialPassengers && initialPassengers.length > 0) {
      setPassengers(initialPassengers);

      // Пытаемся восстановить выбранного клиента из пассажиров
      const passengerFromSystem = initialPassengers.find(p => p.isFromSystem && p.email);

      if (passengerFromSystem && !selectedCustomer) {
        const customer = users.find(u => u.email === passengerFromSystem.email);

        if (customer) {
          setSelectedCustomer(customer);
        }
      }
    }
  }, [initialPassengers, users, selectedCustomer]);

  // Функция для обновления пассажиров с уведомлением родителя
  const updatePassengersList = (newPassengers: Passenger[]) => {
    setPassengers(newPassengers);
    if (handlePassengersChange) {
      handlePassengersChange(newPassengers);
    }
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Разрешенные роли для выбора пассажиров
  const allowedRoles = useMemo(() => ['Customer', 'Partner'], []);

  // Определяем максимальное количество пассажиров на основе выбранного тарифа
  const maxPassengers = useMemo(() => {
    if (!selectedTariff?.carType) return 4; // По умолчанию 4 места (седан)
    
    return CAR_TYPE_CAPACITY[selectedTariff.carType as CarType] || 4;
  }, [selectedTariff]);

  // Проверяем, можно ли добавить еще пассажиров
  const canAddMorePassengers = passengers.length < maxPassengers;

  // Получаем русское название типа автомобиля
  const getCarTypeLabel = (carType: CarType): string => {
    return CarTypeValues[carType] || carType;
  };

  // Функция поиска пользователей через API
  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);

        return;
      }

      try {
        setIsSearching(true);

        // Создаем параметры с множественными ролями как ты показал
        const params = {
          fullName: query,
          fullNameOp: 'Contains' as const,
          size: 50,
          first: true,
          role: allowedRoles // Передаем массив напрямую
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await usersApi.getUsers(params as any);


        setSearchResults(response.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [allowedRoles],
  );

  // Debounced поиск
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  // Логика отображения пользователей
  const filteredUsers = (() => {
    // Если есть поисковый запрос, показываем только результаты поиска
    if (searchQuery.trim()) {
      return searchResults.filter(user => allowedRoles.includes(user.role));
    }

    // Если поиска нет, показываем изначальных пользователей
    return (users || []).filter(user => allowedRoles.includes(user.role));
  })();

  const addPassenger = () => {
    if (!canAddMorePassengers) return;

    const newPassenger: EnhancedPassenger = {
      id: Date.now().toString(),
      firstName: 'Имя не указано',
      lastName: '',
      phone: '',
      email: '',
      isMainPassenger: false,
      isFromSystem: false, // Пассажир создан вручную - редактируемый
      userData: null,
      isUserDataLoaded: true,
    };

    updatePassengersList([...passengers, newPassenger]);
  };

  const removePassenger = (id: string) => {
    const updatedPassengers = passengers.filter(p => p.id !== id);

    // Если удаляем основного пассажира, делаем основным первого из оставшихся
    const removedPassenger = passengers.find(p => p.id === id);

    if (removedPassenger?.isMainPassenger && updatedPassengers.length > 0) {
      updatedPassengers[0].isMainPassenger = true;
    }

    updatePassengersList(updatedPassengers);
  };

  const updatePassenger = (
    id: string,
    field: keyof Passenger,
    value: string | number | boolean,
  ) => {
    updatePassengersList(passengers.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const setMainPassenger = (id: string) => {
    updatePassengersList(
      passengers.map(p => ({
        ...p,
        isMainPassenger: p.id === id,
      })),
    );
  };

  const fillFromCustomer = (customerId: string) => {
    if (!canAddMorePassengers) return;

    const customer = filteredUsers.find(u => u.id === customerId);

    if (customer) {
      // Создаем нового пассажира на основе данных клиента
      const newPassenger: EnhancedPassenger = {
        id: Date.now().toString(),
        firstName: customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Имя не указано',
        lastName: '',
        phone: customer.phoneNumber || customer.phone || '',
        email: customer.email || '',
        isMainPassenger: passengers.length === 0, // Первый пассажир становится основным
        isFromSystem: true, // Помечаем как пассажира из системы
        customerId: customer.id, // Сохраняем ID пользователя
        userData: customer, // Сохраняем данные пользователя
        isUserDataLoaded: true, // Данные уже загружены
      };

      updatePassengersList([...passengers, newPassenger]);
    }
  };

  // Функция для перехода к профилю пользователя
  const handleViewUserProfile = (user: User, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем выбор пользователя при клике на иконку
    const roleMap: Record<string, string> = {
      'Customer': 'customer',
      'Partner': 'partner',
      'Admin': 'admin',
      'Driver': 'driver',
      'Operator': 'operator',
      'Terminal': 'terminal'
    };

    const rolePath = roleMap[user.role] || user.role.toLowerCase();
    const profileUrl = `/users/${rolePath}/${user.id}`;

    window.open(profileUrl, '_blank');
  };

  // Показываем индикатор загрузки, пока данные пассажиров не загружены
  if (isLoadingPassengerData || !passengersDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка данных пассажиров...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col lg:flex-row gap-6 max-h-screen'>
      {/* Левая колонка - Профиль выбранного клиента */}
      <div className='w-full lg:flex-1 flex-shrink-0 lg:sticky lg:top-0 lg:self-start'>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <UserCheck className='h-5 w-5' />
              {selectedCustomer?.role === 'Partner' ? 'Профиль партнера' : 'Профиль клиента'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <div className='space-y-6'>
                {/* Информация о пользователе */}
                <div className='text-center'>
                  <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <User className='h-10 w-10 text-blue-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    {selectedCustomer.fullName ||
                      `${selectedCustomer.firstName || ''} ${selectedCustomer.lastName || ''}`.trim()}
                  </h3>
                  <div className='flex items-center justify-center gap-2 mt-2'>
                    <Badge variant={selectedCustomer.role === 'Partner' ? 'default' : 'secondary'}>
                      {selectedCustomer.role === 'Partner' ? 'Партнер' : 'Клиент'}
                    </Badge>
                    <Badge variant='outline'>Основной пассажир</Badge>
                  </div>
                </div>

                {/* Информация о компании для партнеров */}
                {selectedCustomer.role === 'Partner' && selectedCustomer.profile && (
                  <div className='space-y-4'>
                    <h4 className='font-medium text-gray-900'>Информация о компании</h4>
                    <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                      <div className='w-8 h-8 bg-blue-100 rounded flex items-center justify-center'>
                        <span className='text-blue-600 font-medium text-sm'>🏢</span>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Компания</p>
                        <p className='font-medium'>{selectedCustomer.profile.companyName}</p>
                        <p className='text-xs text-gray-400'>
                          {selectedCustomer.profile.companyType}
                        </p>
                      </div>
                    </div>
                    {selectedCustomer.profile.legalAddress && (
                      <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                        <MapPin className='h-4 w-4 text-gray-500' />
                        <div>
                          <p className='text-sm text-gray-500'>Юридический адрес</p>
                          <p className='font-medium'>{selectedCustomer.profile.legalAddress}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Баллы лояльности для клиентов */}
                {selectedCustomer.role === 'Customer' &&
                  selectedCustomer.loyaltyPoints !== undefined && (
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3 p-3 bg-yellow-50 rounded-lg'>
                        <div className='w-8 h-8 bg-yellow-100 rounded flex items-center justify-center'>
                          <span className='text-yellow-600'>⭐</span>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500'>Баллы лояльности</p>
                          <p className='font-medium'>{selectedCustomer.loyaltyPoints} баллов</p>
                          {selectedCustomer.phantom && (
                            <p className='text-xs text-orange-500'>Временный аккаунт</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Контактная информация */}
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900'>Контактная информация</h4>
                    <button
                      onClick={(e) => handleViewUserProfile(selectedCustomer, e)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      title="Открыть профиль в новой вкладке"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                    </button>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Phone className='h-4 w-4 text-gray-500' />
                    <div>
                      <p className='text-sm text-gray-500'>Телефон</p>
                      <p className='font-medium'>
                        {selectedCustomer.phoneNumber || selectedCustomer.phone || 'Не указан'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <Mail className='h-4 w-4 text-gray-500' />
                    <div>
                      <p className='text-sm text-gray-500'>Email</p>
                      <p className='font-medium'>{selectedCustomer.email || 'Не указан'}</p>
                    </div>
                  </div>

                  {/* Дополнительные контактные данные для партнеров */}
                  {selectedCustomer.role === 'Partner' && selectedCustomer.profile && (
                    <>
                      {selectedCustomer.profile.contactPhone && (
                        <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                          <Phone className='h-4 w-4 text-blue-500' />
                          <div>
                            <p className='text-sm text-blue-600'>Контактный телефон</p>
                            <p className='font-medium'>{selectedCustomer.profile.contactPhone}</p>
                          </div>
                        </div>
                      )}
                      {selectedCustomer.profile.contactEmail && (
                        <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                          <Mail className='h-4 w-4 text-blue-500' />
                          <div>
                            <p className='text-sm text-blue-600'>Контактный email</p>
                            <p className='font-medium'>{selectedCustomer.profile.contactEmail}</p>
                          </div>
                        </div>
                      )}
                      {selectedCustomer.profile.website && (
                        <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                          <div className='w-4 h-4 text-blue-500'>🌐</div>
                          <div>
                            <p className='text-sm text-blue-600'>Веб-сайт</p>
                            <p className='font-medium'>{selectedCustomer.profile.website}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Кнопка добавить как пассажира */}
                <Button
                  onClick={() => fillFromCustomer(selectedCustomer.id)}
                  className='w-full'
                  disabled={
                    passengers.some(p => p.email === selectedCustomer.email) ||
                    !canAddMorePassengers
                  }
                >
                  <Plus className='h-4 w-4 mr-2' />
                  {passengers.some(p => p.email === selectedCustomer.email)
                    ? 'Уже добавлен как пассажир'
                    : !canAddMorePassengers
                    ? `Достигнут лимит (${maxPassengers} мест)`
                    : 'Добавить как пассажира'}
                </Button>
              </div>
            ) : (
              <div className='text-center py-12'>
                <User className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>Клиент не выбран</h3>
                <p className='text-gray-500'>Выберите клиента из списка справа</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Правая колонка - Список пользователей и поиск */}
      <div className='w-full lg:flex-1 flex-shrink-0 flex flex-col'>
        <Card className='flex-1 flex flex-col'>
          <CardHeader className='gap-2'>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Выбор пассажиров
            </CardTitle>
            <p className='text-sm text-muted-foreground'>Показаны только клиенты и партнеры</p>
            {/* Поиск */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Поиск по имени, email или телефону...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10 pr-10'
              />
              {isSearching && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <div className='animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full' />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className='flex-1 overflow-hidden p-0'>
            <div className='space-y-3 h-full overflow-y-auto p-4'>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedCustomer(user)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedCustomer?.id === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                        <User className='h-5 w-5 text-gray-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex justify-between items-center gap-2 mb-1'>
                          <h4 className='font-medium text-gray-900'>
                            {user.fullName ||
                              `${user.firstName || ''} ${user.lastName || ''}`.trim()}
                          </h4>
                          <Badge
                            variant={user.role === 'Partner' ? 'default' : 'secondary'}
                            className='text-xs'
                          >
                            {user.role === 'Partner' ? 'Партнер' : 'Клиент'}
                          </Badge>
                        </div>

                        {/* Для партнеров показываем информацию о компании */}
                        {user.role === 'Partner' && user.profile && (
                          <div className='text-sm text-gray-600 mb-2'>
                            <div className='font-medium'>{user.profile.companyName}</div>
                            <div className='text-xs text-gray-500'>
                              {user.profile.companyType} • {user.profile.legalAddress}
                            </div>
                          </div>
                        )}

                        {/* Для клиентов показываем баллы лояльности */}
                        {user.role === 'Customer' && user.loyaltyPoints !== undefined && (
                          <div className='text-sm text-gray-600 mb-2'>
                            <span className='inline-flex items-center gap-1'>
                              ⭐ {user.loyaltyPoints} баллов лояльности
                              {user.phantom && (
                                <span className='text-xs text-orange-500'>(Временный)</span>
                              )}
                            </span>
                          </div>
                        )}

                        <div className='flex justify-between items-center gap-4 text-sm text-gray-500'>
                          {user.email && (
                            <span className='flex items-center gap-1'>
                              <Mail className='h-3 w-3' />
                              {user.email}
                            </span>
                          )}
                          {(user.phoneNumber || user.phone) && (
                            <span className='flex items-center gap-1'>
                              <Phone className='h-3 w-3' />
                              {user.phoneNumber || user.phone}
                            </span>
                          )}
                          {/* Для партнеров показываем контактный телефон из профиля */}
                          {user.role === 'Partner' && user.profile?.contactPhone && (
                            <span className='flex items-center gap-1'>
                              <Phone className='h-3 w-3' />
                              {user.profile.contactPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <Search className='h-12 w-12 mx-auto mb-3 opacity-50' />
                  <p>Пользователи не найдены</p>
                  <p className='text-sm'>
                    {searchQuery
                      ? 'Попробуйте изменить поисковый запрос'
                      : 'Нет доступных пользователей'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Третья колонка - Список добавленных пассажиров */}
      <div className='w-full lg:flex-1 flex-shrink-0'>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Пассажиры ({passengers.length}/{maxPassengers})
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={addPassenger}
                disabled={!canAddMorePassengers}
                className='flex items-center gap-1'
                title={!canAddMorePassengers ? `Достигнут лимит пассажиров для ${selectedTariff?.carType ? getCarTypeLabel(selectedTariff.carType) : 'данного типа автомобиля'}` : 'Создать нового пассажира'}
              >
                <Plus className='h-4 w-4' />
                Создать
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {passengers.length > 0 ? (
              <div className='space-y-3'>
                {passengers.map(passenger => (
                  <div
                    key={passenger.id}
                    className={`p-4 border rounded-lg ${
                      passenger.isMainPassenger ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                        <User className='h-5 w-5 text-gray-600' />
                      </div>
                      <div className='flex-1'>
                        {passenger.isFromSystem || passenger.userData ? (
                          // Пассажир из системы - только просмотр (НЕ редактируемый)
                          <div className='space-y-2'>
                            <h4 className='font-medium text-gray-900'>
                              {passenger.userData?.fullName || `${passenger.firstName} ${passenger.lastName || ''}`.trim()}
                            </h4>
                            <div className='flex flex-col gap-1 text-sm text-gray-500'>
                              <div className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                <span>{passenger.userData?.phoneNumber || passenger.phone || 'Телефон не указан'}</span>
                              </div>
                              {(passenger.userData?.email || passenger.email) && (
                                <div className='flex items-center gap-1'>
                                  <Mail className='h-3 w-3' />
                                  <span>{passenger.userData?.email || passenger.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Пассажир создан вручную - редактируемый
                          <div className='space-y-2'>
                            <Input
                              placeholder="Введите имя"
                              value={passenger.firstName}
                              onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                              className='font-medium'
                            />
                            <Input
                              placeholder="Введите телефон"
                              value={passenger.phone}
                              onChange={(e) => updatePassenger(passenger.id, 'phone', e.target.value)}
                              className='text-sm'
                            />
                            {passenger.email && (
                              <div className='flex items-center gap-1 text-sm text-gray-500'>
                                <Mail className='h-3 w-3' />
                                <span>{passenger.email}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      {passenger.isMainPassenger && (
                        <Badge variant='default'>Основной пассажир</Badge>
                      )}
                      {!passenger.isMainPassenger && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setMainPassenger(passenger.id)}
                        >
                          Сделать основным
                        </Button>
                      )}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => removePassenger(passenger.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <Users className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>Нет пассажиров</h3>
                <p className='text-gray-500 mb-4'>
                  Добавьте пассажиров для поездки
                </p>
                {selectedTariff && (
                  <div className='mb-4 p-3 bg-blue-50 rounded-lg'>
                    <p className='text-sm text-blue-700 font-medium'>
                      Максимум пассажиров: {maxPassengers} ({getCarTypeLabel(selectedTariff.carType)})
                    </p>
                  </div>
                )}
                <div className='space-y-2 text-sm text-gray-400'>
                  <p>• Выберите клиента из списка и нажмите &quot;Добавить как пассажира&quot;</p>
                  <p>• Или создайте нового пассажира кнопкой &quot;Создать&quot;</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
