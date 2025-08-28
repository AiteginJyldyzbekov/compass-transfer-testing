import {
  HomeIcon,
  HomeActiveIcon,
  ClockIcon,
  ClockActiveIcon,
  ChatIcon,
  NotificationNavIcon,
  NotificationNavActiveIcon,
  StatsNavIcon,
  StatsNavActiveIcon,
  SettingsNavIcon,
  SettingsNavActiveIcon
} from '@shared/icons';

import type React from 'react';

export interface FooterNavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon?: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
}

export const driverMobileNavItems: FooterNavItem[] = [
  {
    id: 'home',
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
    href: '/',
    active: true,
  },
  {
    id: 'orders',
    icon: ClockIcon,
    activeIcon: ClockActiveIcon,
    href: '/orders',
  },
  {
    id: 'notifications',
    icon: NotificationNavIcon,
    activeIcon: NotificationNavActiveIcon,
    href: '/notifications',
  },
  {
    id: 'settings',
    icon: SettingsNavIcon,
    activeIcon: SettingsNavActiveIcon,
    href: '/settings',
  },
  {
    id: 'chat',
    icon: ChatIcon,
    href: '/support',
  },
  {
    id: 'stats',
    icon: StatsNavIcon,
    activeIcon: StatsNavActiveIcon,
    href: '/stats',
  },
];
