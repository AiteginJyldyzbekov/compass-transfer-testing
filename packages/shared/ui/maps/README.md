# Location Map Component

Компонент для выбора местоположения на карте с использованием Яндекс Карт.

## Использование

### LocationMap

Базовый компонент карты для выбора координат:

```tsx
import { LocationMap } from '@shared/ui/maps/location-map';

function MyComponent() {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');

  return (
    <LocationMap
      coordinates={coordinates}
      onCoordinatesChange={setCoordinates}
      onAddressChange={setAddress}
      height="400px"
    />
  );
}
```

### LocationMapSection

Компонент для использования в формах с react-hook-form:

```tsx
import { LocationMapSection } from '@entities/locations';

function LocationForm() {
  return (
    <FormProvider {...form}>
      <LocationMapSection
        labels={{
          coordinates: 'Местоположение на карте *',
        }}
      />
    </FormProvider>
  );
}
```

## Настройка

### Переменные окружения

Добавьте в `.env` файл:

```env
# Yandex Maps API ключ (JavaScript API и HTTP Геокодер)
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=your_api_key_here
```

### Получение API ключа

1. Перейдите на [Яндекс.Разработчикам](https://developer.tech.yandex.ru/)
2. Создайте новое приложение
3. Подключите JavaScript API и HTTP Геокодер
4. Скопируйте API ключ

## Особенности

- **Ограничение области**: Карта ограничена территорией Кыргызстана
- **Автоматический геокодинг**: При клике на карту автоматически получается адрес
- **Интеграция с формами**: Автоматически обновляет поля latitude и longitude
- **Поиск**: Встроенный поиск по адресам с ограничением по Кыргызстану
- **Адаптивность**: Подстраивается под размер контейнера

## API

### LocationMap Props

| Prop | Type | Description |
|------|------|-------------|
| `coordinates` | `[number, number] \| null` | Текущие координаты [широта, долгота] |
| `onCoordinatesChange` | `(coords: [number, number]) => void` | Callback при изменении координат |
| `onAddressChange` | `(address: string) => void` | Callback при изменении адреса |
| `height` | `string` | Высота карты (по умолчанию: "500px") |
| `className` | `string` | CSS класс для контейнера |

### LocationMapSection Props

| Prop | Type | Description |
|------|------|-------------|
| `labels.coordinates` | `string` | Заголовок секции карты |
