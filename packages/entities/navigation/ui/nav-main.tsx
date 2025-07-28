'use client';

import { IconCirclePlusFilled, IconMail } from '@tabler/icons-react';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@shared/ui/forms/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@shared/ui/layout/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import { OrderTypeSelectionModal } from '@features/orders';

// Тип для элемента меню
interface MenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType;
  items?: {
    title: string;
    url: string;
  }[];
}

// Функция для генерации путей
const getRouteForItem = (title: string, url?: string): string => {
  // Если есть URL, используем его
  if (url) {
    return url;
  }

  // Fallback для старых данных
  const routes: Record<string, string> = {
    Playground: '/',
    Models: '/models',
    Documentation: '/documentation',
    Settings: '/settings',
  };

  return routes[title] || `/${title.toLowerCase()}`;
};

export function NavMain({ items }: { items: MenuItem[] }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center gap-2'>
            <SidebarMenuButton
              tooltip='Создать заказ'
              className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
              onClick={() => setIsOrderTypeModalOpen(true)}
            >
              <IconCirclePlusFilled />
              <span className='group-data-[collapsible=icon]:hidden'>Создать Заказ</span>
            </SidebarMenuButton>
            <Button
              size='icon'
              className='size-8 group-data-[collapsible=icon]:opacity-0'
              variant='outline'
            >
              <IconMail />
              <span className='sr-only'>Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map(item => {
            const href = getRouteForItem(item.title, item.url);
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <Link href={href} prefetch>
                    {item.icon && <item.icon />}
                    <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                <DropdownMenu
                  modal={false}
                  onOpenChange={open => {
                    // Убираем focus когда dropdown закрывается
                    if (!open) {
                      setTimeout(() => {
                        const button = document.querySelector(
                          '[data-state="closed"][data-sidebar="menu-action"]',
                        ) as HTMLButtonElement;

                        if (button) button.blur();
                      }, 0);
                    }
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className='data-[state=open]:bg-accent rounded-sm focus-visible:ring-0 focus:ring-0'
                      onBlur={(e: React.FocusEvent<HTMLButtonElement>) => e.target.blur()}
                    >
                      <MoreHorizontal />
                      <span className='sr-only'>More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-48 rounded-lg'
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    {item.items?.map((subItem: { title: string; url: string }) => (
                      <DropdownMenuItem key={subItem.title} asChild>
                        <Link href={subItem.url} prefetch>
                          <span>{subItem.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>

      {/* Модальное окно выбора типа заказа */}
      <OrderTypeSelectionModal
        isOpen={isOrderTypeModalOpen}
        onClose={() => setIsOrderTypeModalOpen(false)}
      />
    </SidebarGroup>
  );
}
