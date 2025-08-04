'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Textarea } from '@shared/ui/forms/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { partnerRegisterSchema, type PartnerRegisterFormData } from '@entities/auth';
import { useRegisterPartner } from '../hooks/useRegisterPartner';

export function PartnerRegisterForm() {
  const { registerPartner, isLoading, error, success, fieldErrors, clearFieldError } = useRegisterPartner();

  const form = useForm<PartnerRegisterFormData>({
    resolver: zodResolver(partnerRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      companyName: '',
      legalAddress: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: PartnerRegisterFormData) => {
    await registerPartner(data);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Регистрация успешна!</CardTitle>
          <CardDescription>
            Ваша заявка на регистрацию отправлена. Вы будете перенаправлены на страницу входа.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Регистрация партнера</CardTitle>
        <CardDescription>
          Создайте аккаунт партнера для работы с системой Compass Transfer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              onFocus={() => clearFieldError('email')}
              className={errors.email || fieldErrors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Минимум 6 символов"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">ФИО *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Иванов Иван Иванович"
              {...register('fullName')}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Название компании *</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="ООО Транспорт Сервис"
              {...register('companyName')}
              className={errors.companyName ? 'border-red-500' : ''}
            />
            {errors.companyName && (
              <p className="text-sm text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalAddress">Юридический адрес *</Label>
            <Textarea
              id="legalAddress"
              placeholder="г. Бишкек, ул. Примерная, д. 123"
              rows={3}
              {...register('legalAddress')}
              className={errors.legalAddress ? 'border-red-500' : ''}
            />
            {errors.legalAddress && (
              <p className="text-sm text-red-600">{errors.legalAddress.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
