'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Checkbox } from '@shared/ui/forms/checkbox';
import type { NotificationCreateFormData } from '../schemas/notificationCreateSchema';

interface NotificationRelationsSectionProps {
  labels?: {
    orderId?: string;
    rideId?: string;
    userId?: string;
    isRead?: string;
  };
  placeholders?: {
    orderId?: string;
    rideId?: string;
    userId?: string;
  };
  showIsRead?: boolean;
}

export function NotificationRelationsSection({
  labels = {},
  placeholders = {},
  showIsRead = false,
}: NotificationRelationsSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<NotificationCreateFormData>();

  const isRead = watch('isRead');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Связанные данные</h3>
      
      {/* ID заказа */}
      <div className="space-y-2">
        <Label htmlFor="orderId" className="text-sm font-medium">
          {labels.orderId || 'ID заказа'}
        </Label>
        <Input
          id="orderId"
          {...register('orderId')}
          placeholder={placeholders.orderId || 'Введите UUID заказа (необязательно)'}
          className="w-full"
        />
        {errors.orderId && (
          <p className="text-sm text-red-600">{errors.orderId.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          UUID заказа, к которому относится уведомление
        </p>
      </div>

      {/* ID поездки */}
      <div className="space-y-2">
        <Label htmlFor="rideId" className="text-sm font-medium">
          {labels.rideId || 'ID поездки'}
        </Label>
        <Input
          id="rideId"
          {...register('rideId')}
          placeholder={placeholders.rideId || 'Введите UUID поездки (необязательно)'}
          className="w-full"
        />
        {errors.rideId && (
          <p className="text-sm text-red-600">{errors.rideId.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          UUID поездки, к которой относится уведомление
        </p>
      </div>

      {/* ID пользователя */}
      <div className="space-y-2">
        <Label htmlFor="userId" className="text-sm font-medium">
          {labels.userId || 'ID пользователя'}
        </Label>
        <Input
          id="userId"
          {...register('userId')}
          placeholder={placeholders.userId || 'Введите UUID пользователя (необязательно)'}
          className="w-full"
        />
        {errors.userId && (
          <p className="text-sm text-red-600">{errors.userId.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          UUID пользователя, которому предназначено уведомление
        </p>
      </div>

      {/* Статус прочтения (только для редактирования) */}
      {showIsRead && (
        <div className="flex flex-row items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="isRead"
            checked={isRead}
            onCheckedChange={(checked) => setValue('isRead', checked)}
          />
          <div className="flex-1 space-y-0.5">
            <Label htmlFor="isRead" className="text-sm font-medium cursor-pointer">
              {labels.isRead || 'Уведомление прочитано'}
            </Label>
            <div className="text-sm text-muted-foreground">
              Отметить уведомление как прочитанное
            </div>
            {errors.isRead && (
              <p className="text-sm text-red-600">{errors.isRead.message}</p>
            )}
          </div>
        </div>
      )}

      <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Информация
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Все поля в этой секции необязательны. Заполните только те, которые относятся к вашему уведомлению.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
