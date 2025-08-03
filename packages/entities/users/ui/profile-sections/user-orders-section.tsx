'use client';

import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { UserOrdersTable } from '@features/user-orders/table/user-orders-table';

interface UserOrdersSectionProps {
  userId: string;
}

export function UserOrdersSection({ userId }: UserOrdersSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingCart className='h-5 w-5' />
          Заказы пользователя
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserOrdersTable userId={userId} />
      </CardContent>
    </Card>
  );
}
