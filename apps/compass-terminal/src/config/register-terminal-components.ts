// Регистрация компонентов терминала (унификация с админ-панелью)
import { Locations } from '@pages/terminal/locations';
import { Main } from '@pages/terminal/main';
import { Payment } from '@pages/terminal/payment';
import { Receipt } from '@pages/terminal/receipt';
import { registerTerminalComponents } from './terminal-routes';

// Централизованная инициализация компонентов терминала
export function initializeTerminalComponents() {
  // ========================================
  // РЕГИСТРАЦИЯ КОМПОНЕНТОВ ТЕРМИНАЛА
  // ========================================

  // Главная страница
  registerTerminalComponents('main', {
    component: Main,
    title: 'Терминал | Compass 2.0',
    description: 'Главная страница терминала',
    requiresLanguage: true,
  });

  // Страница локаций
  registerTerminalComponents('locations', {
    component: Locations,
    title: 'Локации | Compass 2.0',
    description: 'Выбор локации',
  });

  // Страница оплаты
  registerTerminalComponents('payment', {
    component: Payment,
    title: 'Оплата | Compass 2.0',
    description: 'Страница оплаты',
  });

  // Страница чека
  registerTerminalComponents('receipt', {
    component: Receipt,
    title: 'Чек | Compass 2.0',
    description: 'Страница чека',
  });
}
