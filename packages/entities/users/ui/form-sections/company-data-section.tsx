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
import { type CompanyDataFields } from '@entities/users/model/validation/ui/company-data';

interface CompanyDataSectionProps {
  companyTypeOptions: ReadonlyArray<{ readonly value: string; readonly label: string }>;
}

export function CompanyDataSection({ companyTypeOptions }: CompanyDataSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<{ profile: CompanyDataFields['profile'] }>();
  const profile = watch('profile');
  const profileErrors = errors.profile ?? {};

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Данные компании</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='companyName'>Название компании *</Label>
          <Input
            id='companyName'
            {...register('profile.companyName')}
            placeholder='Введите название компании'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              profileErrors.companyName ? 'border-red-500' : ''
            }`}
          />
          {profileErrors.companyName && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.companyName.message === 'string'
                ? profileErrors.companyName.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='companyType'>Тип компании *</Label>
          <Select
            value={profile?.companyType || ''}
            onValueChange={value => setValue('profile.companyType', value)}
          >
            <SelectTrigger
              className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                profileErrors.companyType ? 'border-red-500' : ''
              }`}
            >
              <SelectValue placeholder='Выберите тип компании' />
            </SelectTrigger>
            <SelectContent>
              {companyTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {profileErrors.companyType && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.companyType.message === 'string'
                ? profileErrors.companyType.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='registrationNumber'>Регистрационный номер (ОГРН/ОГРНИП)</Label>
          <Input
            id='registrationNumber'
            {...register('profile.registrationNumber')}
            placeholder='Введите регистрационный номер'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              profileErrors.registrationNumber ? 'border-red-500' : ''
            }`}
          />
          {profileErrors.registrationNumber && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.registrationNumber.message === 'string'
                ? profileErrors.registrationNumber.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='taxIdentifier'>ИНН партнера</Label>
          <Input
            id='taxIdentifier'
            {...register('profile.taxIdentifier')}
            placeholder='Введите ИНН'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              profileErrors.taxIdentifier ? 'border-red-500' : ''
            }`}
          />
          {profileErrors.taxIdentifier && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.taxIdentifier.message === 'string'
                ? profileErrors.taxIdentifier.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='md:col-span-2 space-y-2'>
          <Label htmlFor='legalAddress'>Юридический адрес *</Label>
          <Input
            id='legalAddress'
            {...register('profile.legalAddress')}
            placeholder='Введите юридический адрес'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              profileErrors.legalAddress ? 'border-red-500' : ''
            }`}
          />
          {profileErrors.legalAddress && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.legalAddress.message === 'string'
                ? profileErrors.legalAddress.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='contactEmail'>Контактный email</Label>
          <Input
            id='contactEmail'
            type='email'
            {...register('profile.contactEmail')}
            placeholder='contact@company.com'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              profileErrors.contactEmail ? 'border-red-500' : ''
            }`}
          />
          {profileErrors.contactEmail && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.contactEmail.message === 'string'
                ? profileErrors.contactEmail.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='contactPhone'>Контактный телефон</Label>
          <Input
            id='contactPhone'
            type='tel'
            {...register('profile.contactPhone')}
            placeholder='+996 555 123 456'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              profileErrors.contactPhone ? 'border-red-500' : ''
            }`}
          />
          {profileErrors.contactPhone && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.contactPhone.message === 'string'
                ? profileErrors.contactPhone.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='md:col-span-2 space-y-2'>
          <Label htmlFor='website'>Веб-сайт</Label>
          <Input
            id='website'
            type='url'
            {...register('profile.website')}
            placeholder='https://www.company.com'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              profileErrors.website ? 'border-red-500' : ''
            }`}
          />
          {profileErrors.website && (
            <p className='text-sm text-red-500'>
              {typeof profileErrors.website.message === 'string'
                ? profileErrors.website.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
