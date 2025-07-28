'use client';

import { MoreHorizontal, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
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
// Тип для элемента меню
interface MenuItem {
  title: string;
  url?: string;
  icon?: React.ComponentType;
  items?: {
    title: string;
    url: string;
  }[];
}

// Функция для генерации путей для вторичной навигации
const getSecondaryRoute = (title: string): string => {
  const routes: Record<string, string> = {
    Support: '/support',
    Feedback: '/feedback',
  };

  return routes[title] || `/${title.toLowerCase()}`;
};

export function NavSecondary({
  items,
  ...props
}: {
  items: MenuItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
                     {items.map(item => {
             const href = getSecondaryRoute(item.title)
             const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
             
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
                  className='w-36 rounded-lg'
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <Plus />
                    <span>Создать</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
                               </DropdownMenu>
               </SidebarMenuItem>
             )
           })}
           </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
