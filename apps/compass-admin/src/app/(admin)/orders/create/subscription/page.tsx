'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { Button } from '@shared/ui/forms/button';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function SubscriptionOrderCreatePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">Создание подписки</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Подписка</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Регулярные поездки по расписанию
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mx-auto mb-4">
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">В разработке</h3>
            <p className="text-muted-foreground mb-6">
              Форма создания подписки находится в разработке.
              <br />
              Пока вы можете создавать только мгновенные заказы.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                Назад
              </Button>
              <Button
                onClick={() => router.push('/orders/create/instant')}
              >
                Создать мгновенный заказ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
