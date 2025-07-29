'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { cn } from '@shared/lib/utils';
import { NotificationType, NotificationTypeValues, NotificationTypeLabels } from '../enums/NotificationType.enum';
import type { NotificationCreateFormData } from '../schemas/notificationCreateSchema';

// Типы заказов
const OrderTypeOptions = [
  { value: 'Unknown', label: 'Неизвестный' },
  { value: 'Instant', label: 'Мгновенный' },
  { value: 'Scheduled', label: 'Запланированный' },
  { value: 'Partner', label: 'Партнерский' },
  { value: 'Shuttle', label: 'Шаттл' },
  { value: 'Subscription', label: 'Подписка' },
];

interface NotificationBasicSectionProps {
  showOptionalWarning?: boolean;
  labels?: {
    type?: string;
    title?: string;
    content?: string;
    orderType?: string;
  };
  placeholders?: {
    title?: string;
    content?: string;
  };
}

export function NotificationBasicSection({
  showOptionalWarning = false,
  labels = {},
  placeholders = {},
}: NotificationBasicSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<NotificationCreateFormData>();

  const type = watch('type');
  const orderType = watch('orderType');

  return (
    <div className="space-y-6">
      {/* Тип уведомления */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {labels.type || 'Тип уведомления *'}
        </Label>
        <Select
          value={type}
          onValueChange={(value) => setValue('type', value as NotificationType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите тип уведомления" />
          </SelectTrigger>
          <SelectContent>
            {NotificationTypeValues.map((notificationType) => (
              <SelectItem key={notificationType} value={notificationType}>
                {NotificationTypeLabels[notificationType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Заголовок */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          {labels.title || 'Заголовок уведомления *'}
        </Label>
        <Input
          id="title"
          {...register('title')}
          placeholder={placeholders.title || 'Введите заголовок уведомления'}
          className="w-full"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Содержимое */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium">
          {labels.content || 'Содержимое уведомления'}
        </Label>
        <textarea
          id="content"
          {...register('content')}
          placeholder={placeholders.content || 'Введите содержимое уведомления (необязательно)'}
          className={cn(
            "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 no-ring resize-none"
          )}
          rows={4}
        />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* Тип заказа */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {labels.orderType || 'Тип заказа'}
        </Label>
        <Select
          value={orderType}
          onValueChange={(value) => setValue('orderType', value as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите тип заказа (необязательно)" />
          </SelectTrigger>
          <SelectContent>
            {OrderTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.orderType && (
          <p className="text-sm text-red-600">{errors.orderType.message}</p>
        )}
      </div>
    </div>
  );
}
