'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { CarColor, VehicleType, ServiceClass, VehicleStatus, VEHICLE_TYPE_CAPACITY } from '../enums';
import type { CarCreateFormData } from '../schemas/carCreateSchema';

// Лейблы для цветов автомобилей
const carColorLabels: Record<CarColor, string> = {
  [CarColor.White]: 'Белый',
  [CarColor.Black]: 'Черный',
  [CarColor.Silver]: 'Серебристый',
  [CarColor.Gray]: 'Серый',
  [CarColor.Red]: 'Красный',
  [CarColor.Blue]: 'Синий',
  [CarColor.Green]: 'Зеленый',
  [CarColor.Yellow]: 'Желтый',
  [CarColor.Orange]: 'Оранжевый',
  [CarColor.Brown]: 'Коричневый',
  [CarColor.Purple]: 'Фиолетовый',
  [CarColor.Gold]: 'Золотой',
  [CarColor.Other]: 'Другой',
};

// Лейблы для типов автомобилей
const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.Sedan]: 'Седан',
  [VehicleType.Hatchback]: 'Хэтчбек',
  [VehicleType.SUV]: 'Внедорожник',
  [VehicleType.Minivan]: 'Минивэн',
  [VehicleType.Coupe]: 'Купе',
  [VehicleType.Cargo]: 'Грузовой',
  [VehicleType.Pickup]: 'Пикап',
};

// Лейблы для классов обслуживания
const serviceClassLabels: Record<ServiceClass, string> = {
  [ServiceClass.Economy]: 'Эконом',
  [ServiceClass.Comfort]: 'Комфорт',
  [ServiceClass.ComfortPlus]: 'Комфорт+',
  [ServiceClass.Business]: 'Бизнес',
  [ServiceClass.Premium]: 'Премиум',
  [ServiceClass.Vip]: 'VIP',
  [ServiceClass.Luxury]: 'Люкс',
};

// Лейблы для статусов автомобиля
const vehicleStatusLabels: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: 'Доступен',
  [VehicleStatus.Maintenance]: 'На обслуживании',
  [VehicleStatus.Repair]: 'На ремонте',
  [VehicleStatus.Other]: 'Другое',
};

interface CarBasicSectionProps {
  showOptionalWarning?: boolean;
  labels?: {
    make?: string;
    model?: string;
    year?: string;
    color?: string;
    licensePlate?: string;
    type?: string;
    serviceClass?: string;
    status?: string;
    passengerCapacity?: string;
  };
  placeholders?: {
    make?: string;
    model?: string;
    year?: string;
    licensePlate?: string;
    passengerCapacity?: string;
  };
}

export function CarBasicSection({
  labels = {},
  placeholders = {},
}: CarBasicSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CarCreateFormData>();

  const formData = watch();

  return (
    <div className="space-y-6">
      {/* Марка и модель */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium">
            {labels.make || 'Марка автомобиля *'}
          </Label>
          <Input
            id="make"
            {...register('make')}
            placeholder={placeholders.make || 'Toyota'}
            className="w-full"
          />
          {errors.make && (
            <p className="text-sm text-red-600">{errors.make.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            {labels.model || 'Модель автомобиля *'}
          </Label>
          <Input
            id="model"
            {...register('model')}
            placeholder={placeholders.model || 'Camry'}
            className="w-full"
          />
          {errors.model && (
            <p className="text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>
      </div>

      {/* Год выпуска и цвет */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">
            {labels.year || 'Год выпуска *'}
          </Label>
          <Input
            id="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            placeholder={placeholders.year || '2022'}
            className="w-full"
            {...register('year', {
              valueAsNumber: true,
              setValueAs: (value) => value === '' ? undefined : parseInt(value)
            })}
          />
          {errors.year && (
            <p className="text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {labels.color || 'Цвет автомобиля *'}
          </Label>
          <Select
            value={formData.color || CarColor.White}
            onValueChange={(value) => setValue('color', value as CarColor, { shouldValidate: true, shouldDirty: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите цвет" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CarColor).map((colorValue) => (
                <SelectItem key={colorValue} value={colorValue}>
                  {carColorLabels[colorValue]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.color && (
            <p className="text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>
      </div>

      {/* Госномер */}
      <div className="space-y-2">
        <Label htmlFor="licensePlate" className="text-sm font-medium">
          {labels.licensePlate || 'Государственный номер *'}
        </Label>
        <Input
          id="licensePlate"
          {...register('licensePlate')}
          placeholder={placeholders.licensePlate || '01KG123ABC'}
          className="w-full"
        />
        {errors.licensePlate && (
          <p className="text-sm text-red-600">{errors.licensePlate.message}</p>
        )}
      </div>

      {/* Тип и класс обслуживания */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {labels.type || 'Тип автомобиля *'}
          </Label>
          <Select
            value={formData.type || VehicleType.Sedan}
            onValueChange={(value) => {
              const vehicleType = value as VehicleType;

              setValue('type', vehicleType, { shouldValidate: true, shouldDirty: true });
              // Автоматически устанавливаем пассажировместимость в зависимости от типа
              const capacity = VEHICLE_TYPE_CAPACITY[vehicleType];
              
              setValue('passengerCapacity', capacity, { shouldValidate: true, shouldDirty: true });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(VehicleType).map((typeValue) => (
                <SelectItem key={typeValue} value={typeValue}>
                  {vehicleTypeLabels[typeValue]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {labels.serviceClass || 'Класс обслуживания *'}
          </Label>
          <Select
            value={formData.serviceClass || ServiceClass.Economy}
            onValueChange={(value) => setValue('serviceClass', value as ServiceClass, { shouldValidate: true, shouldDirty: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите класс" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ServiceClass).map((classValue) => (
                <SelectItem key={classValue} value={classValue}>
                  {serviceClassLabels[classValue]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceClass && (
            <p className="text-sm text-red-600">{errors.serviceClass.message}</p>
          )}
        </div>
      </div>

      {/* Статус и пассажировместимость */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {labels.status || 'Статус автомобиля *'}
          </Label>
          <Select
            value={formData.status || VehicleStatus.Available}
            onValueChange={(value) => setValue('status', value as VehicleStatus, { shouldValidate: true, shouldDirty: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(VehicleStatus).map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {vehicleStatusLabels[statusValue]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passengerCapacity" className="text-sm font-medium">
            {labels.passengerCapacity || 'Пассажировместимость *'}
          </Label>
          <div className="relative">
            <Input
              id="passengerCapacity"
              type="number"
              value={formData.passengerCapacity || VEHICLE_TYPE_CAPACITY[formData.type || VehicleType.Sedan]}
              readOnly
              className="w-full bg-gray-50 cursor-not-allowed"
              {...register('passengerCapacity', {
                valueAsNumber: true,
                setValueAs: (value) => value === '' ? undefined : parseInt(value)
              })}
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-xs text-gray-500">Автоматически</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Пассажировместимость устанавливается автоматически в зависимости от типа автомобиля
          </p>
          {errors.passengerCapacity && (
            <p className="text-sm text-red-600">{errors.passengerCapacity.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
