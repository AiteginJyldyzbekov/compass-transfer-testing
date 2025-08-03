'use client';

import { ChevronUp, ChevronDown, Edit, Trash2, Users, MoreHorizontal, Eye } from 'lucide-react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Badge } from '@shared/ui/data-display/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/data-display/table';
import { Button } from '@shared/ui/forms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import { useUserRole } from '@shared/contexts';
import {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  CarFeature,
} from '@entities/cars/enums';
import { Role } from '@entities/users/enums';
import type { GetCarDTO } from '@entities/cars/interface';

interface ColumnVisibility {
  make: boolean;
  model: boolean;
  year: boolean;
  color: boolean;
  licensePlate: boolean;
  type: boolean;
  serviceClass: boolean;
  status: boolean;
  passengerCapacity: boolean;
  features: boolean;
  drivers: boolean;
}

interface CarsTableContentProps {
  paginatedCars: GetCarDTO[];
  columnVisibility: ColumnVisibility;
  router: AppRouterInstance;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: string) => void;
  onDeleteCar: (car: GetCarDTO) => void;
}

// Переводы для enum значений
const colorLabels: Record<CarColor, string> = {
  [CarColor.Black]: 'Черный',
  [CarColor.White]: 'Белый',
  [CarColor.Silver]: 'Серебристый',
  [CarColor.Gray]: 'Серый',
  [CarColor.Red]: 'Красный',
  [CarColor.Blue]: 'Синий',
  [CarColor.Green]: 'Зеленый',
  [CarColor.Yellow]: 'Желтый',
  [CarColor.Brown]: 'Коричневый',
  [CarColor.Orange]: 'Оранжевый',
  [CarColor.Purple]: 'Фиолетовый',
  [CarColor.Gold]: 'Золотой',
  [CarColor.Other]: 'Другой',
};

const typeLabels: Record<VehicleType, string> = {
  [VehicleType.Sedan]: 'Седан',
  [VehicleType.Hatchback]: 'Хэтчбек',
  [VehicleType.SUV]: 'Внедорожник',
  [VehicleType.Minivan]: 'Минивэн',
  [VehicleType.Coupe]: 'Купе',
  [VehicleType.Cargo]: 'Грузовой',
  [VehicleType.Pickup]: 'Пикап',
};

const serviceClassLabels: Record<ServiceClass, string> = {
  [ServiceClass.Economy]: 'Эконом',
  [ServiceClass.Comfort]: 'Комфорт',
  [ServiceClass.ComfortPlus]: 'Комфорт+',
  [ServiceClass.Business]: 'Бизнес',
  [ServiceClass.Premium]: 'Премиум',
  [ServiceClass.Vip]: 'VIP',
  [ServiceClass.Luxury]: 'Люкс',
};

const statusLabels: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: 'Доступен',
  [VehicleStatus.Maintenance]: 'Обслуживание',
  [VehicleStatus.Repair]: 'Ремонт',
  [VehicleStatus.Other]: 'Другое',
};

const statusColors: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: 'bg-green-100 text-green-800',
  [VehicleStatus.Maintenance]: 'bg-yellow-100 text-yellow-800',
  [VehicleStatus.Repair]: 'bg-red-100 text-red-800',
  [VehicleStatus.Other]: 'bg-gray-100 text-gray-800',
};

const featureLabels: Record<CarFeature, string> = {
  [CarFeature.AirConditioning]: 'Кондиционер',
  [CarFeature.ClimateControl]: 'Климат-контроль',
  [CarFeature.LeatherSeats]: 'Кожаные сиденья',
  [CarFeature.HeatedSeats]: 'Подогрев сидений',
  [CarFeature.Bluetooth]: 'Bluetooth',
  [CarFeature.USBPort]: 'USB-порт',
  [CarFeature.AuxInput]: 'AUX-вход',
  [CarFeature.Navigation]: 'Навигация',
  [CarFeature.BackupCamera]: 'Камера заднего вида',
  [CarFeature.ParkingSensors]: 'Парктроник',
  [CarFeature.Sunroof]: 'Люк',
  [CarFeature.PanoramicRoof]: 'Панорамная крыша',
  [CarFeature.ThirdRowSeats]: 'Третий ряд сидений',
  [CarFeature.ChildSeat]: 'Детское кресло',
  [CarFeature.WheelchairAccess]: 'Доступ для инвалидных колясок',
  [CarFeature.Wifi]: 'Wi-Fi',
  [CarFeature.PremiumAudio]: 'Премиум аудио',
  [CarFeature.AppleCarplay]: 'Apple CarPlay',
  [CarFeature.AndroidAuto]: 'Android Auto',
  [CarFeature.SmokingAllowed]: 'Разрешено курение',
  [CarFeature.PetFriendly]: 'Можно с животными',
  [CarFeature.LuggageCarrier]: 'Багажник на крыше',
  [CarFeature.BikeRack]: 'Крепление для велосипедов',
};

export function CarsTableContent({
  paginatedCars,
  columnVisibility,
  router,
  sortBy,
  sortOrder,
  handleSort,
  onDeleteCar,
}: CarsTableContentProps) {
  const { userRole } = useUserRole();

  // Проверяем, может ли пользователь редактировать и удалять автомобили (все роли кроме Operator)
  const canEditCars = userRole !== Role.Operator;
  const canDeleteCars = userRole !== Role.Operator;
  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => {
    const isActive = sortBy === field;

    return (
      <TableHead
        className="cursor-pointer hover:bg-muted/50 select-none"
        onClick={() => handleSort(field)}
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
  };

  if (paginatedCars.length === 0) {
    return;
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.make && <SortableHeader field='make'>Марка</SortableHeader>}
            {columnVisibility.model && <SortableHeader field='model'>Модель</SortableHeader>}
            {columnVisibility.year && <SortableHeader field='year'>Год</SortableHeader>}
            {columnVisibility.color && <SortableHeader field='color'>Цвет</SortableHeader>}
            {columnVisibility.licensePlate && <SortableHeader field='licensePlate'>Гос. номер</SortableHeader>}
            {columnVisibility.type && <SortableHeader field='type'>Тип</SortableHeader>}
            {columnVisibility.serviceClass && <SortableHeader field='serviceClass'>Класс</SortableHeader>}
            {columnVisibility.status && <SortableHeader field='status'>Статус</SortableHeader>}
            {columnVisibility.passengerCapacity && <SortableHeader field='passengerCapacity'>Места</SortableHeader>}
            {columnVisibility.features && <TableHead>Опции</TableHead>}
            {columnVisibility.drivers && <TableHead>Водители</TableHead>}
            <TableHead className='w-[50px]'>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCars.map((car) => (
            <TableRow key={car.id} className='hover:bg-muted/50'>
              {columnVisibility.make && (
                <TableCell className='font-medium'>{car.make}</TableCell>
              )}
              {columnVisibility.model && (
                <TableCell>{car.model}</TableCell>
              )}
              {columnVisibility.year && (
                <TableCell>{car.year}</TableCell>
              )}
              {columnVisibility.color && (
                <TableCell>{colorLabels[car.color]}</TableCell>
              )}
              {columnVisibility.licensePlate && (
                <TableCell className='font-mono'>{car.licensePlate}</TableCell>
              )}
              {columnVisibility.type && (
                <TableCell>{typeLabels[car.type]}</TableCell>
              )}
              {columnVisibility.serviceClass && (
                <TableCell>{serviceClassLabels[car.serviceClass]}</TableCell>
              )}
              {columnVisibility.status && (
                <TableCell>
                  <Badge className={statusColors[car.status]}>
                    {statusLabels[car.status]}
                  </Badge>
                </TableCell>
              )}
              {columnVisibility.passengerCapacity && (
                <TableCell>{car.passengerCapacity}</TableCell>
              )}
              {columnVisibility.features && (
                <TableCell>
                  <div className='flex flex-wrap gap-1'>
                    {car.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant='outline' className='text-xs'>
                        {featureLabels[feature]}
                      </Badge>
                    ))}
                    {car.features.length > 3 && (
                      <Badge variant='outline' className='text-xs'>
                        +{car.features.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              )}
              {columnVisibility.drivers && (
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <span>{car.drivers?.length || 0}</span>
                  </div>
                </TableCell>
              )}
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
                    <DropdownMenuItem onClick={() => router.push(`/cars/${car.id}`)}>
                      <Eye className='mr-2 h-4 w-4' />
                      Просмотр
                    </DropdownMenuItem>
                    {canEditCars && (
                      <DropdownMenuItem onClick={() => router.push(`/cars/edit/${car.id}`)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Редактировать
                      </DropdownMenuItem>
                    )}
                    {canDeleteCars && (
                      <DropdownMenuItem onClick={() => onDeleteCar(car)} className='text-red-600'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Удалить
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
