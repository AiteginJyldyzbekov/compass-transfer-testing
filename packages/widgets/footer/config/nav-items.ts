import { Home, Clock, BarChart3, Bell, Settings, MessageCircle } from 'lucide-react';
import type React from 'react';

export interface FooterNavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
}

export const driverMobileNavItems: FooterNavItem[] = [
  {
    id: 'home',
    icon: Home,
    href: '/',
    active: true,
  },
  {
    id: 'orders',
    icon: Clock,
    href: '/orders',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    href: '/chat',
  },
  {
    id: 'notifications',
    icon: Bell,
    href: '/notifications',
  },
  {
    id: 'stats',
    icon: BarChart3,
    href: '/stats',
  },
  {
    id: 'settings',
    icon: Settings,
    href: '/settings',
  },
];
