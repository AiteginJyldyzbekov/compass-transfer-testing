import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent } from '@shared/ui/layout';

interface ScheduledOrderViewErrorProps {
  error: string;
  onRetry?: () => void;
  onBack: () => void;
}

export function ScheduledOrderViewError({ error, onRetry, onBack }: ScheduledOrderViewErrorProps) {
  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white flex flex-col gap-6 p-6 overflow-y-auto'>
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
            <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center'>
              <AlertCircle className='h-8 w-8 text-red-600' />
            </div>
            
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                Заказ не найден
              </h2>
              <p className='text-gray-600 max-w-md'>
                {error}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <Button onClick={onBack} variant='outline'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Вернуться к списку
              </Button>
              
              {onRetry && (
                <Button onClick={onRetry} variant='default'>
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Попробовать снова
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
