'use client';

import { MapPin, X } from 'lucide-react';
import { LeafletMap } from '@shared/components/map/DynamicLeafletMap';
import { Button } from '@shared/ui/forms/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/modals/sheet';

interface MapSheetProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  latitude?: number;
  longitude?: number;
  title?: string;
}

export function MapSheet({
  isOpen,
  onClose,
  address,
  latitude,
  longitude,
  title = 'Местоположение',
}: MapSheetProps) {
  // Координаты по умолчанию (центр Бишкека)
  const defaultLat = 42.8746;
  const defaultLng = 74.5698;

  const mapLatitude = latitude || defaultLat;
  const mapLongitude = longitude || defaultLng;

  const routePoints = [
    {
      latitude: mapLatitude,
      longitude: mapLongitude,
      name: address,
      type: 'start' as const,
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side='right' className='w-[400px] sm:w-[540px] overflow-y-auto p-0'>
        <div className='flex flex-col h-full'>
          <SheetHeader className='p-4 border-b mb-0'>
            <div className='flex items-center justify-between'>
              <SheetTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' />
                {title}
              </SheetTitle>
              <Button variant='ghost' size='sm' onClick={onClose} className='h-8 w-8 p-0'>
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='text-sm text-muted-foreground text-left'>{address}</div>
          </SheetHeader>

          <div className='flex-1 relative min-h-[400px]'>
            <LeafletMap
              latitude={mapLatitude}
              longitude={mapLongitude}
              zoom={15}
              height='400px'
              routePoints={routePoints}
              showRoute={false}
              showActiveDrivers={false}
              className='rounded-none'
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
