'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/modals/dialog';
import { Button } from '@shared/ui/forms/button';
import { Badge } from '@shared/ui/data-display/badge';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Label } from '@shared/ui/forms/label';
import { CarFeature } from '@entities/cars/enums';
import type { GetCarDTO } from '@entities/cars/interface';

interface ManageFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: GetCarDTO;
  onUpdateFeatures: (features: CarFeature[]) => Promise<void>;
}

// Переводы опций автомобиля
const carFeatureLabels: Record<CarFeature, string> = {
  [CarFeature.AirConditioning]: 'Кондиционер',
  [CarFeature.ClimateControl]: 'Климат-контроль',
  [CarFeature.LeatherSeats]: 'Кожаные сидения',
  [CarFeature.HeatedSeats]: 'Подогрев сидений',
  [CarFeature.Bluetooth]: 'Bluetooth',
  [CarFeature.USBPort]: 'USB-порт',
  [CarFeature.AuxInput]: 'AUX-вход',
  [CarFeature.Navigation]: 'Навигация',
  [CarFeature.BackupCamera]: 'Камера заднего вида',
  [CarFeature.ParkingSensors]: 'Парковочные датчики',
  [CarFeature.Sunroof]: 'Люк',
  [CarFeature.PanoramicRoof]: 'Панорамная крыша',
  [CarFeature.ThirdRowSeats]: 'Третий ряд сидений',
  [CarFeature.ChildSeat]: 'Детское кресло',
  [CarFeature.WheelchairAccess]: 'Доступ для инвалидных колясок',
  [CarFeature.Wifi]: 'Wi-Fi',
  [CarFeature.PremiumAudio]: 'Премиальная аудиосистема',
  [CarFeature.AppleCarplay]: 'Apple CarPlay',
  [CarFeature.AndroidAuto]: 'Android Auto',
  [CarFeature.SmokingAllowed]: 'Разрешено курение',
  [CarFeature.PetFriendly]: 'Дружелюбно к питомцам',
  [CarFeature.LuggageCarrier]: 'Багажник на крыше',
  [CarFeature.BikeRack]: 'Велосипедная стойка',
};

// Группировка опций по категориям
const featureCategories = {
  comfort: {
    title: 'Комфорт',
    features: [
      CarFeature.AirConditioning,
      CarFeature.ClimateControl,
      CarFeature.LeatherSeats,
      CarFeature.HeatedSeats,
      CarFeature.Sunroof,
      CarFeature.PanoramicRoof,
    ],
  },
  technology: {
    title: 'Технологии',
    features: [
      CarFeature.Bluetooth,
      CarFeature.USBPort,
      CarFeature.AuxInput,
      CarFeature.Navigation,
      CarFeature.Wifi,
      CarFeature.PremiumAudio,
      CarFeature.AppleCarplay,
      CarFeature.AndroidAuto,
    ],
  },
  safety: {
    title: 'Безопасность',
    features: [
      CarFeature.BackupCamera,
      CarFeature.ParkingSensors,
    ],
  },
  accessibility: {
    title: 'Доступность',
    features: [
      CarFeature.ThirdRowSeats,
      CarFeature.ChildSeat,
      CarFeature.WheelchairAccess,
      CarFeature.PetFriendly,
    ],
  },
  additional: {
    title: 'Дополнительно',
    features: [
      CarFeature.SmokingAllowed,
      CarFeature.LuggageCarrier,
      CarFeature.BikeRack,
    ],
  },
};

export function ManageFeaturesModal({ 
  isOpen, 
  onClose, 
  car, 
  onUpdateFeatures 
}: ManageFeaturesModalProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<CarFeature[]>(
    car.features || []
  );
  const [loading, setLoading] = useState(false);

  const handleFeatureToggle = (feature: CarFeature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdateFeatures(selectedFeatures);
      onClose();
    } catch (error) {
      console.error('Ошибка обновления опций:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFeatures(car.features || []);
    onClose();
  };

  const hasChanges = JSON.stringify(selectedFeatures.sort()) !== JSON.stringify((car.features || []).sort());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Управление опциями автомобиля</DialogTitle>
          <p className="text-sm text-gray-600">
            {car.make} {car.model} ({car.licensePlate})
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {Object.entries(featureCategories).map(([key, category]) => (
            <div key={key} className="space-y-3">
              <h3 className="font-medium text-gray-900">{category.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label
                      htmlFor={feature}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {carFeatureLabels[feature]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Предварительный просмотр выбранных опций */}
        {selectedFeatures.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Выбранные опции ({selectedFeatures.length}):
            </h4>
            <div className="flex flex-wrap gap-1">
              {selectedFeatures.map((feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  {carFeatureLabels[feature]}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Сохранить изменения
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
