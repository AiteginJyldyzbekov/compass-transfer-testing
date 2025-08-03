'use client';

import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { UserRidesTable } from '@features/user-rides/table/user-rides-table';

interface UserRidesSectionProps {
  userId: string;
}

export function UserRidesSection({ userId }: UserRidesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Car className='h-5 w-5' />
          Поездки пользователя
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserRidesTable userId={userId} />
      </CardContent>
    </Card>
  );
}
