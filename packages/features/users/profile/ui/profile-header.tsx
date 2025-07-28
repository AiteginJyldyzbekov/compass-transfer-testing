'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/data-display/avatar';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent } from '@shared/ui/layout/card';
import {
  getStatusColor,
  getStatusLabel,
} from '@entities/my-profile';
import type { AnyUserProfile } from '@entities/users';
import { getRoleLabel, getRoleColor, getInitials } from '@entities/users/utils'
import { ProfileOrderStats } from './profile-order-stats';

interface ProfileHeaderProps {
  profile: AnyUserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  console.log('ProfileHeader - profile.online:', profile.online);
  console.log('ProfileHeader - profile data:', JSON.stringify(profile, null, 2));

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
          {/* Аватар и основная информация */}
          <div className='flex items-center gap-4 w-full lg:w-2/5'>
            <Avatar className='h-16 w-16 sm:h-20 sm:w-20'>
              <AvatarImage src={profile.avatarUrl || ''} alt={profile.fullName} />
              <AvatarFallback className='text-base sm:text-lg'>{getInitials(profile.fullName)}</AvatarFallback>
            </Avatar>
            <div className='space-y-2 flex-1 min-w-0'>
              <h1 className='text-xl sm:text-2xl font-bold truncate'>{profile.fullName}</h1>
              <div className='flex flex-wrap gap-2'>
                <Badge className={getRoleColor(profile.role)}>{getRoleLabel(profile.role)}</Badge>
                <Badge className={getStatusColor(profile.online)}>
                  {getStatusLabel(profile.online)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Статистика заказов */}
          <div className='w-full lg:w-3/5'>
            <ProfileOrderStats />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
