'use client';

import { Clock, Zap, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@shared/ui/forms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/modals/dialog';
import { OrderType } from '@entities/orders/enums/OrderType.enum';

interface OrderTypeOption {
  type: OrderType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  route: string;
  disabled?: boolean;
}

const orderTypeOptions: OrderTypeOption[] = [
  {
    type: OrderType.Instant,
    title: 'Мгновенный заказ',
    description: 'Заказ на ближайшее время для клиента',
    icon: Zap,
    color: 'bg-green-100 text-green-600',
    route: '/orders/create/instant',
  },
  {
    type: OrderType.Scheduled,
    title: 'Запланированный заказ',
    description: 'Заказ на определенную дату и время',
    icon: Clock,
    color: 'bg-blue-100 text-blue-600',
    route: '/orders/create/scheduled',
  },
  // {
  //   type: OrderType.Partner,
  //   title: 'Партнерский заказ',
  //   description: 'Заказ от партнерской организации',
  //   icon: Users,
  //   color: 'bg-purple-100 text-purple-600',
  //   route: '/orders/create/partner',
  //   disabled: true, // Пока не реализовано
  // },
  // {
  //   type: OrderType.Shuttle,
  //   title: 'Шаттл',
  //   description: 'Заезд по регулярному маршруту',
  //   icon: Truck,
  //   color: 'bg-orange-100 text-orange-600',
  //   route: '/orders/create/shuttle',
  //   disabled: true, // Пока не реализовано
  // },
  // {
  //   type: OrderType.Subscription,
  //   title: 'Подписка',
  //   description: 'Регулярные поездки по расписанию',
  //   icon: Calendar,
  //   color: 'bg-indigo-100 text-indigo-600',
  //   route: '/orders/create/subscription',
  //   disabled: true, // Пока не реализовано
  // },
];

interface OrderTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTariffId?: string;
}

export function OrderTypeSelectionModal({ isOpen, onClose, selectedTariffId }: OrderTypeSelectionModalProps) {
  const router = useRouter();

  const handleOrderTypeSelect = (option: OrderTypeOption) => {
    if (option.disabled) return;

    onClose();

    // Добавляем tariffId в URL если он передан
    const url = selectedTariffId
      ? `${option.route}?tariffId=${selectedTariffId}`
      : option.route;

    router.push(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] z-[1001]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <HelpCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Выберите тип заказа
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Выберите подходящий тип заказа для создания
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orderTypeOptions.map((option) => {
              const Icon = option.icon;
              
              return (
                <Button
                  key={option.type}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-start text-left space-y-3 hover:shadow-md transition-all duration-200 ${
                    option.disabled 
                      ? 'opacity-50 cursor-not-allowed hover:shadow-none' 
                      : 'hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => handleOrderTypeSelect(option)}
                  disabled={option.disabled}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{option.title}</h3>
                      {option.disabled && (
                        <span className="text-xs text-muted-foreground">(В разработке)</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
