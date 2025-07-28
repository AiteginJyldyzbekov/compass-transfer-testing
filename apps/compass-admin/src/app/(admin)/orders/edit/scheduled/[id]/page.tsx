'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { Button } from '@shared/ui/forms/button';
import { Clock, ArrowLeft } from 'lucide-react';

interface ScheduledOrderEditPageProps {
  params: Promise<{ id: string }>;
}

export default function ScheduledOrderEditPage({ params }: ScheduledOrderEditPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);

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
        <h1 className="text-2xl font-bold">Редактирование запланированного заказа #{resolvedParams.id}</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Запланированный заказ</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Редактирование заказа на определенную дату и время
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">В разработке</h3>
            <p className="text-muted-foreground mb-6">
              Форма редактирования запланированного заказа находится в разработке.
              <br />
              ID заказа: <code className="bg-muted px-2 py-1 rounded">{resolvedParams.id}</code>
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                Назад
              </Button>
              <Button
                onClick={() => router.push(`/orders/${resolvedParams.id}`)}
              >
                Просмотр заказа
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
