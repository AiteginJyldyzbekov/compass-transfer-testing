'use client';

import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { UIPassenger } from '../interfaces';

interface PassengersInfoCardProps {
  passengers: UIPassenger[];
}

/**
 * Компонент для отображения информации о пассажирах в сводке заказа
 */
export function PassengersInfoCard({
  passengers
}: PassengersInfoCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Пассажиры ({passengers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {passengers.length > 0 ? (
          <div className="space-y-3">
            {passengers.map((passenger, index) => (
              <div key={passenger.id || index} className="border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
                {passenger.phoneNumber && <p className="text-sm text-gray-600">Телефон: {passenger.phoneNumber}</p>}
                {passenger.email && <p className="text-sm text-gray-600">Email: {passenger.email}</p>}
                {passenger.age && <p className="text-sm text-gray-600">Возраст: {passenger.age}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Пассажиры не выбраны</p>
        )}
      </CardContent>
    </Card>
  );
}
