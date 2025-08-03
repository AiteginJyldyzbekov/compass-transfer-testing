import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent } from '@shared/ui/layout';

interface LocationViewErrorProps {
  error: string;
  onRetry?: () => void;
  onBack: () => void;
}

export function LocationViewError({ error, onRetry, onBack }: LocationViewErrorProps) {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <Card>
        <CardContent className='p-12 text-center'>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center'>
              <AlertTriangle className='h-8 w-8 text-red-600' />
            </div>
            
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Ошибка загрузки локации
              </h2>
              <p className='text-gray-600 max-w-md'>
                {error}
              </p>
            </div>

            <div className='flex items-center gap-3 mt-6'>
              <Button
                variant='outline'
                onClick={onBack}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Назад к списку
              </Button>
              
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className='flex items-center gap-2'
                >
                  <RefreshCw className='h-4 w-4' />
                  Повторить
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
