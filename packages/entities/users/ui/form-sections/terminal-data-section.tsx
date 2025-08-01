'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import { TERMINAL_STATUS_OPTIONS } from '@entities/users/enums';
import { type TerminalDataFields } from '@entities/users/model/validation/ui/terminal-data';
import { useAirportLocations } from '@features/locations/hooks';

export function TerminalDataSection() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<{
    profile: TerminalDataFields['profile'];
    status: string;
    locationId: string;
  }>();
  const formData = watch();

  // Получаем локации аэропортов
  const { airportLocations, isLoading: isLoadingLocations, error: locationsError } = useAirportLocations();

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Данные терминала</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='terminalId'>ID терминала *</Label>
          <Input
            id='terminalId'
            {...register('profile.terminalId')}
            placeholder='Введите ID терминала'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.terminalId ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.terminalId && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.terminalId.message === 'string'
                ? errors.profile.terminalId.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='status'>Статус *</Label>
          <Select value={formData.status} onValueChange={value => setValue('status', value)}>
            <SelectTrigger
              className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                errors.status ? 'border-red-500' : ''
              }`}
            >
              <SelectValue placeholder='Выберите статус' />
            </SelectTrigger>
            <SelectContent>
              {TERMINAL_STATUS_OPTIONS.map((option: { value: string; label: string }) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className='text-sm text-red-500'>
              {typeof errors.status.message === 'string'
                ? errors.status.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='locationId'>Локация (Аэропорт) *</Label>
          <Select
            value={formData.locationId}
            onValueChange={(value: string) => setValue('locationId', value)}
            disabled={isLoadingLocations}
          >
            <SelectTrigger
              className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                errors.locationId ? 'border-red-500' : ''
              }`}
            >
              <SelectValue
                placeholder={
                  isLoadingLocations
                    ? 'Загрузка аэропортов...'
                    : airportLocations.length === 0
                      ? 'Аэропорты не найдены'
                      : 'Выберите аэропорт'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {airportLocations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.address}
                </SelectItem>
              ))}
              {airportLocations.length === 0 && !isLoadingLocations && (
                <SelectItem value='' disabled>
                  Аэропорты не найдены
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.locationId && (
            <p className='text-sm text-red-500'>
              {typeof errors.locationId.message === 'string'
                ? errors.locationId.message
                : 'Ошибка валидации'}
            </p>
          )}
          {locationsError && (
            <p className='text-sm text-red-500'>
              Ошибка загрузки аэропортов: {locationsError}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='ipAddress'>IP адрес</Label>
          <Input
            id='ipAddress'
            {...register('profile.ipAddress')}
            placeholder='192.168.1.1'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.ipAddress ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.ipAddress && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.ipAddress.message === 'string'
                ? errors.profile.ipAddress.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='deviceModel'>Модель устройства</Label>
          <Input
            id='deviceModel'
            {...register('profile.deviceModel')}
            placeholder='iPhone 14, Samsung Galaxy S23'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.deviceModel ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.deviceModel && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.deviceModel.message === 'string'
                ? errors.profile.deviceModel.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='osVersion'>Версия ОС</Label>
          <Input
            id='osVersion'
            {...register('profile.osVersion')}
            placeholder='iOS 17.0, Android 13'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.osVersion ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.osVersion && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.osVersion.message === 'string'
                ? errors.profile.osVersion.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='appVersion'>Версия приложения</Label>
          <Input
            id='appVersion'
            {...register('profile.appVersion')}
            placeholder='1.0.0'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.appVersion ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.appVersion && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.appVersion.message === 'string'
                ? errors.profile.appVersion.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='browserInfo'>Информация о браузере</Label>
          <Input
            id='browserInfo'
            {...register('profile.browserInfo')}
            placeholder='Chrome 120.0.0.0, Safari 17.0'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.browserInfo ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.browserInfo && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.browserInfo.message === 'string'
                ? errors.profile.browserInfo.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='screenResolution'>Разрешение экрана</Label>
          <Input
            id='screenResolution'
            {...register('profile.screenResolution')}
            placeholder='1920x1080, 375x812'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.screenResolution ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.screenResolution && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.screenResolution.message === 'string'
                ? errors.profile.screenResolution.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='deviceIdentifier'>Идентификатор устройства</Label>
          <Input
            id='deviceIdentifier'
            {...register('profile.deviceIdentifier')}
            placeholder='Уникальный ID устройства'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.deviceIdentifier ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.deviceIdentifier && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.deviceIdentifier.message === 'string'
                ? errors.profile.deviceIdentifier.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
