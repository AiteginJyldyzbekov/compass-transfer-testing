'use client';

import { Skeleton } from '@shared/ui/data-display/skeleton';
import { Card, CardContent, CardHeader } from '@shared/ui/layout/card';

export function ProfileLoading() {
  return (
    <div className='space-y-6'>
      {/* Header Loading */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row md:items-start gap-6'>
            <div className='flex items-center gap-4'>
              <Skeleton className='h-20 w-20 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-8 w-48' />
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-6 w-16' />
                </div>
              </div>
            </div>
            <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-3'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-40' />
              </div>
              <div className='space-y-3'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-4 w-36' />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info Loading */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-40' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-32' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Specific Loading */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-4 w-36' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
