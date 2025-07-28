// Конфигурация маршрутов терминала (унифицированная система)
import type { ComponentType } from 'react';

// Типы для терминальных маршрутов
export type TerminalRouteName = 'main' | 'locations' | 'payment' | 'receipt';

// Интерфейс для конфигурации маршрута
export interface TerminalRouteConfig {
  component: ComponentType<Record<string, unknown>>;
  title: string;
  description: string;
  requiresLanguage?: boolean;
}

// Реестр компонентов терминала (динамический)
const terminalRoutes: Record<string, TerminalRouteConfig> = {};

// Функция для регистрации компонентов терминала
export function registerTerminalComponents(
  routeName: TerminalRouteName,
  config: TerminalRouteConfig,
): void {
  terminalRoutes[routeName] = config;
}

// Функции для получения конфигурации маршрутов
export function getTerminalRouteConfig(routeName: TerminalRouteName): TerminalRouteConfig | null {
  return terminalRoutes[routeName] || null;
}

export function getTerminalComponent(routeName: TerminalRouteName): ComponentType<Record<string, unknown>> | null {
  const config = getTerminalRouteConfig(routeName);

  return config?.component || null;
}

export function getTerminalMetadata(routeName: TerminalRouteName) {
  const config = getTerminalRouteConfig(routeName);

  if (!config) return null;

  return {
    title: config.title,
    description: config.description,
  };
}

export function getAllTerminalRoutes(): TerminalRouteName[] {
  return Object.keys(terminalRoutes) as TerminalRouteName[];
}

// Проверка существования маршрута
export function isValidTerminalRoute(routeName: string): routeName is TerminalRouteName {
  return routeName in terminalRoutes;
}
