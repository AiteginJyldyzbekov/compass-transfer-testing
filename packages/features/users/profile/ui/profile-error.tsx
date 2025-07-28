'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent } from '@shared/ui/layout/card';

interface ProfileErrorProps {
  error: string;
  onRetry: () => void;
}

export function ProfileError({ error, onRetry }: ProfileErrorProps) {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex flex-col items-center justify-center text-center space-y-4'>
          <div className='rounded-full bg-red-100 p-3'>
            <AlertCircle className='h-6 w-6 text-red-600' />
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Ошибка загрузки профиля</h3>
            <p className='text-sm text-muted-foreground max-w-md'>{error}</p>
          </div>

          <Button onClick={onRetry} variant='outline' className='gap-2'>
            <RefreshCw className='h-4 w-4' />
            Попробовать снова
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
