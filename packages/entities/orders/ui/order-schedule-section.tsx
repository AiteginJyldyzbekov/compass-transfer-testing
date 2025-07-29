'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Textarea } from '@shared/ui/forms/textarea';
import type { CreateScheduledOrderDTOType } from '../schemas';

interface OrderScheduleSectionProps {
  showOptionalWarning?: boolean;
  labels?: {
    scheduledTime?: string;
    description?: string;
    airFlight?: string;
    flyReis?: string;
  };
  placeholders?: {
    scheduledTime?: string;
    description?: string;
    airFlight?: string;
    flyReis?: string;
  };
}

export function OrderScheduleSection({
  showOptionalWarning = false,
  labels = {},
  placeholders = {},
}: OrderScheduleSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateScheduledOrderDTOType>();

  return (
    <div className='space-y-6'>
      {/* Время отправки */}
      <div className='space-y-2'>
        <Label htmlFor='scheduledTime' className='flex items-center gap-1'>
          {labels.scheduledTime || 'Дата и время отправки'}
          <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='scheduledTime'
          type='datetime-local'
          {...register('scheduledTime')}
          placeholder={placeholders.scheduledTime || 'Выберите дату и время'}
          className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
            errors.scheduledTime ? 'border-red-500' : ''
          }`}
        />
        {errors.scheduledTime && (
          <p className='text-sm text-red-500'>{errors.scheduledTime.message}</p>
        )}
      </div>

      {/* Описание заказа */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='flex items-center gap-1'>
          {labels.description || 'Описание заказа'}
          {showOptionalWarning && <span className='text-muted-foreground text-sm'>(необязательно)</span>}
        </Label>
        <Textarea
          id='description'
          {...register('description')}
          placeholder={placeholders.description || 'Дополнительная информация о заказе...'}
          rows={3}
          className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow resize-none ${
            errors.description ? 'border-red-500' : ''
          }`}
        />
        {errors.description && (
          <p className='text-sm text-red-500'>{errors.description.message}</p>
        )}
      </div>

      {/* Номер рейса прилета */}
      <div className='space-y-2'>
        <Label htmlFor='airFlight' className='flex items-center gap-1'>
          {labels.airFlight || 'Номер рейса прилета'}
          {showOptionalWarning && <span className='text-muted-foreground text-sm'>(необязательно)</span>}
        </Label>
        <Input
          id='airFlight'
          {...register('airFlight')}
          placeholder={placeholders.airFlight || 'Например: SU1234'}
          className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
            errors.airFlight ? 'border-red-500' : ''
          }`}
        />
        {errors.airFlight && (
          <p className='text-sm text-red-500'>{errors.airFlight.message}</p>
        )}
      </div>

      {/* Номер рейса вылета */}
      <div className='space-y-2'>
        <Label htmlFor='flyReis' className='flex items-center gap-1'>
          {labels.flyReis || 'Номер рейса вылета'}
          {showOptionalWarning && <span className='text-muted-foreground text-sm'>(необязательно)</span>}
        </Label>
        <Input
          id='flyReis'
          {...register('flyReis')}
          placeholder={placeholders.flyReis || 'Например: SU5678'}
          className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
            errors.flyReis ? 'border-red-500' : ''
          }`}
        />
        {errors.flyReis && (
          <p className='text-sm text-red-500'>{errors.flyReis.message}</p>
        )}
      </div>
    </div>
  );
}
