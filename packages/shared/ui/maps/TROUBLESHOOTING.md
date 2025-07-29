# Устранение неполадок с Яндекс Картами

## Проблемы с Content Security Policy (CSP)

### Ошибка: "Refused to load the script"

**Симптомы:**
```
Refused to load the script 'https://api-maps.yandex.ru/2.1/...' because it violates the following Content Security Policy directive: "script-src 'self' 'unsafe-inline' 'unsafe-eval'".
```

**Решение:**
Обновите CSP в `next.config.ts`:

```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; connect-src 'self' ... https://api-maps.yandex.ru https://geocode-maps.yandex.ru; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api-maps.yandex.ru; img-src 'self' data: https: https://core-renderer-tiles.maps.yandex.net;",
}
```

### Ошибка: "Refused to connect"

**Симптомы:**
```
Refused to connect to 'https://geocode-maps.yandex.ru/...' because it violates the document's Content Security Policy.
```

**Решение:**
Добавьте домены Яндекс в `connect-src`:
- `https://api-maps.yandex.ru`
- `https://geocode-maps.yandex.ru`

## Проблемы с API ключом

### Карта не загружается

**Проверьте:**
1. API ключ установлен в `.env`:
   ```env
   NEXT_PUBLIC_YANDEX_MAPS_API_KEY=your_api_key_here
   ```

2. Переменная доступна в браузере:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY);
   ```

3. Перезапустите сервер разработки после изменения `.env`

### Ошибка геокодирования

**Симптомы:**
- Адрес не получается по координатам
- Ошибки в консоли при запросах к geocode-maps.yandex.ru

**Решение:**
1. Убедитесь, что API ключ поддерживает HTTP Геокодер
2. Проверьте лимиты использования API
3. Проверьте правильность формата запроса

## Проблемы с координатами

### Координаты 0,0 по умолчанию

**Решение:**
Используйте `undefined` вместо `0` для неустановленных координат:

```typescript
defaultValues: {
  latitude: undefined,
  longitude: undefined,
}
```

## Отладка

### Включение логирования

Добавьте в компонент карты:

```typescript
console.log('API Key:', process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY ? 'Установлен' : 'Не найден');
console.log('Координаты:', coordinates);
```

### Проверка загрузки карты

```typescript
const handleMapLoad = (ymaps: any) => {
  console.log('Карта загружена:', ymaps);
};
```

## Альтернативные решения

### Если карты не работают

1. **Проверьте сетевое подключение**
2. **Используйте VPN** (если есть блокировки)
3. **Попробуйте другой API ключ**
4. **Проверьте статус сервисов Яндекс**

### Fallback решение

Можно добавить fallback на обычные поля ввода:

```typescript
{!isMapLoaded && (
  <div>
    <Input name="latitude" placeholder="Широта" />
    <Input name="longitude" placeholder="Долгота" />
  </div>
)}
```
