'use client';

import { MapPin } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';

interface AddressMapButtonProps {
  address: string;
  latitude?: number;
  longitude?: number;
  title?: string;
  onShowMap: (data: {
    address: string;
    latitude?: number;
    longitude?: number;
    title?: string;
  }) => void;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function AddressMapButton({
  address,
  latitude,
  longitude,
  title,
  onShowMap,
  variant = 'ghost',
  size = 'sm',
  className,
}: AddressMapButtonProps) {
  const handleClick = () => {
    onShowMap({
      address,
      latitude,
      longitude,
      title,
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`gap-1 ${className || ''}`}
      title={`Показать "${address}" на карте`}
    >
      <MapPin className='h-3 w-3' />
      Карта
    </Button>
  );
}
