import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout';
import type { GetOrderDTO } from '@entities/orders/interface';
import { useUserRole } from '@shared/contexts';
import { Role } from '@entities/users/enums';

interface InstantOrderViewActionsProps {
  order: GetOrderDTO;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export function InstantOrderViewActions({
  order,
  onEdit,
  onDelete,
  onBack
}: InstantOrderViewActionsProps) {
  const { userRole } = useUserRole();

  // Операторы не могут удалять заказы
  const canDelete = userRole !== Role.Operator;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Действия</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Button 
          onClick={onBack} 
          variant='outline' 
          className='w-full justify-start'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Назад к списку
        </Button>
        
        <Button 
          onClick={onEdit} 
          variant='default' 
          className='w-full justify-start'
        >
          <Edit className='h-4 w-4 mr-2' />
          Редактировать
        </Button>



        {canDelete && (
          <Button
            onClick={onDelete}
            variant='destructive'
            className='w-full justify-start'
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Удалить
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
