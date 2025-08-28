# Footer Widget

Компонент footer для мобильного приложения водителей с поддержкой safe area и кроссбраузерной совместимостью.

## Компоненты

### DriverMobileFooter

Основной компонент footer с навигационными иконками.

**Особенности:**
- Фиксированное позиционирование внизу экрана
- Поддержка safe area insets для iOS Safari
- Адаптивные иконки (обычные и активные)
- Поддержка уведомлений с бейджами
- Кроссбраузерная совместимость

### FooterSpacer

Компонент для добавления отступа под footer, чтобы основной контент не перекрывался.

## Использование

### Рекомендуемый способ (с отступом в main):

```tsx
import { DriverMobileFooter } from '@widgets/footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto pb-20 safe-area-bottom">
        {children}
      </main>
      <DriverMobileFooter />
    </div>
  );
}
```

### Альтернативный способ (с FooterSpacer):

```tsx
import { DriverMobileFooter, FooterSpacer } from '@widgets/footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <FooterSpacer />
      <DriverMobileFooter />
    </div>
  );
}
```

## Поддерживаемые браузеры

- ✅ iOS Safari (с поддержкой safe area)
- ✅ Android Chrome
- ✅ Desktop браузеры
- ✅ Safari на macOS

## CSS классы

### Safe Area Support

- `.safe-area-bottom` - отступ снизу с учетом safe area
- `.safe-area-top` - отступ сверху с учетом safe area
- `.safe-area-left` - отступ слева с учетом safe area
- `.safe-area-right` - отступ справа с учетом safe area

### Fallback классы

Для браузеров без поддержки safe area insets:
- `.pb-safe-area-inset-bottom`
- `.pt-safe-area-inset-top`
- `.pl-safe-area-inset-left`
- `.pr-safe-area-inset-right`

## Настройка viewport

Для корректной работы на мобильных устройствах добавьте в `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

## Иконки

Footer использует SVG иконки из `@shared/icons`:
- `HomeIcon` / `HomeActiveIcon`
- `ClockIcon` / `ClockActiveIcon`
- `ChatIcon`
- `NotificationNavIcon` / `NotificationNavActiveIcon`
- `StatsNavIcon` / `StatsNavActiveIcon`
- `SettingsNavIcon` / `SettingsNavActiveIcon`

Все иконки поддерживают `className` для стилизации.
