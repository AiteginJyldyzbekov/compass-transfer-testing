'use client';

import { useFormContext } from 'react-hook-form';
import { Label } from '@shared/ui/forms/label';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { CarFeature, CarFeatureValues } from '../enums';
import type { CarCreateFormData } from '../schemas/carCreateSchema';

// Лейблы для дополнительных опций
const carFeatureLabels: Record<CarFeature, string> = {
  [CarFeature.AirConditioning]: 'Кондиционер',
  [CarFeature.ClimateControl]: 'Климат-контроль',
  [CarFeature.LeatherSeats]: 'Кожаные сиденья',
  [CarFeature.HeatedSeats]: 'Подогрев сидений',
  [CarFeature.Bluetooth]: 'Bluetooth',
  [CarFeature.USBPort]: 'USB-порт',
  [CarFeature.AuxInput]: 'AUX-вход',
  [CarFeature.Navigation]: 'Навигация',
  [CarFeature.BackupCamera]: 'Камера заднего вида',
  [CarFeature.ParkingSensors]: 'Парктроник',
  [CarFeature.Sunroof]: 'Люк',
  [CarFeature.PanoramicRoof]: 'Панорамная крыша',
  [CarFeature.ThirdRowSeats]: 'Третий ряд сидений',
  [CarFeature.ChildSeat]: 'Детское кресло',
  [CarFeature.WheelchairAccess]: 'Доступ для инвалидных колясок',
  [CarFeature.Wifi]: 'Wi-Fi',
  [CarFeature.PremiumAudio]: 'Премиум аудиосистема',
  [CarFeature.AppleCarplay]: 'Apple CarPlay',
  [CarFeature.AndroidAuto]: 'Android Auto',
  [CarFeature.SmokingAllowed]: 'Разрешено курение',
  [CarFeature.PetFriendly]: 'Можно с животными',
  [CarFeature.LuggageCarrier]: 'Багажник на крыше',
  [CarFeature.BikeRack]: 'Крепление для велосипедов',
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
      CarFeature.AppleCarplay,
      CarFeature.AndroidAuto,
      CarFeature.PremiumAudio,
    ],
  },
  safety: {
    title: 'Безопасность',
    features: [
      CarFeature.BackupCamera,
      CarFeature.ParkingSensors,
    ],
  },
  space: {
    title: 'Пространство',
    features: [
      CarFeature.Sunroof,
      CarFeature.PanoramicRoof,
      CarFeature.ThirdRowSeats,
    ],
  },
  accessibility: {
    title: 'Доступность',
    features: [
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

interface CarFeaturesSectionProps {
  labels?: {
    features?: string;
  };
}

export function CarFeaturesSection({
  labels = {},
}: CarFeaturesSectionProps) {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CarCreateFormData>();

  const features = watch('features') || [];

  const handleFeatureToggle = (feature: CarFeature, checked: boolean) => {
    const currentFeatures = features || [];
    
    if (checked) {
      // Добавляем опцию, если её нет
      if (!currentFeatures.includes(feature)) {
        setValue('features', [...currentFeatures, feature]);
      }
    } else {
      // Убираем опцию
      setValue('features', currentFeatures.filter(f => f !== feature));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {labels.features || 'Дополнительные опции *'}
        </Label>
        <p className="text-sm text-muted-foreground">
          Выберите дополнительные опции автомобиля
        </p>
        {errors.features && (
          <p className="text-sm text-red-600">{errors.features.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(featureCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="space-y-4">
            <h4 className="font-medium text-sm text-gray-900">{category.title}</h4>
            <div className="space-y-3">
              {category.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={features.includes(feature)}
                    onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                  />
                  <Label
                    htmlFor={`feature-${feature}`}
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

      {/* Показываем выбранные опции */}
      {features.length > 0 && (
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Выбранные опции ({features.length})
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {carFeatureLabels[feature]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
