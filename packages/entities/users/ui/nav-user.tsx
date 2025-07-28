'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/data-display/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@shared/ui/layout/sidebar';
import type { GetUserSelfProfileDTO } from '../interface';

// Helper function to get user initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function NavUser({ user }: { user: GetUserSelfProfileDTO }) {
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='border-2 cursor-pointer bg-white shadow-sm'
          onClick={() => router.push('/profile')}
        >
          <Avatar className='h-8 w-8 rounded-lg grayscale'>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
            <AvatarFallback className='rounded-lg'>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
            <span className='truncate font-medium'>{user.fullName}</span>
            <span className='text-muted-foreground truncate text-xs'>{user.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
