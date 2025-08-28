'use client';

import Image from 'next/image';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/data-display/avatar';
import { useProfileData } from '@features/my-profile';

export function DriverMobileHeader() {
  const { profile, isLoading } = useProfileData();

  if (isLoading) {
    return (
      <header className='bg-white shadow-sm border-b mx-2 mt-1 px-3 py-2 safe-area-top rounded-2xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0' />
            <div className='space-y-1 flex-1 min-w-0'>
              <div className='w-20 h-3 bg-gray-200 rounded animate-pulse' />
              <div className='w-28 h-2 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>
          <div className='w-12 h-6 bg-gray-200 rounded animate-pulse flex-shrink-0' />
        </div>
      </header>
    );
  }

  return (
    <header className='bg-[#F9F9F9] mx-2 mt-1 relative overflow-hidden safe-area-top rounded-[20px]'>
      <div className='flex items-center justify-between relative z-30'>
        {/* Профиль водителя */}
        <div className='flex items-center p-2 gap-2 flex-1 min-w-0'>
          <Avatar className='w-[40px] h-[40px] flex-shrink-0'>
            <AvatarImage src={profile?.avatarUrl || ''} alt={profile?.fullName || 'User'} />
            <AvatarFallback className='bg-blue-100 text-blue-600 font-medium text-sm' >
              {profile?.fullName?.split(' ').map(name => name[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className='flex flex-col min-w-0 flex-1'>
            <div className='flex items-center gap-2'>
              <h1 className='font-medium text-[##000000] text-[13px] leading-tight max-w-[160px] break-words'>
                {profile?.fullName}
              </h1>
            </div>
            <div className='flex items-center gap-1'>
              <span className='text-[9px] text-[#92929D] font-medium truncate'>
                {profile?.phoneNumber ?
                  profile.phoneNumber.replace(/(\+996)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4') :
                  profile?.phoneNumber
                }
              </span>
            </div>
          </div>
        </div>

        {/* Изображение машины справа - уменьшенное */}
        <div className='flex-shrink-0 ml-1'>
          <Image
            src='/car/HongQi E-QM5.png'
            alt='HongQi E-QM5'
            width={100}
            height={45}
            className='object-contain object-right'
            priority
          />
        </div>
      </div>
    </header>
  );
}
