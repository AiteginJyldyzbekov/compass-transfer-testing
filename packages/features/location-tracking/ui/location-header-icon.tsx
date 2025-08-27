'use client';

import { MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { LocationModal } from './location-modal';
import { useLocation } from './location-provider';

export function LocationHeaderIcon() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationName, setLocationName] = useState<string>('');
  const { isTracking, error, permissionStatus } = useLocation();

  const getIconColor = () => {
    if (error || permissionStatus === 'denied') return 'bg-red-500';
    if (isTracking) return 'bg-[#66EE40]';
    return 'text-gray-400';
  };

  const getTooltipText = () => {
    if (error) return 'Ошибка геолокации';
    if (permissionStatus === 'denied') return 'Геолокация запрещена';
    if (isTracking) {
      return locationName ? `${locationName}` : 'Геолокация активна';
    }
    return 'Геолокация отключена';
  };

  const handleLocationNameChange = (name: string) => {
    setLocationName(name);
  };

  const truncateLocationName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Location name display */}
        {isTracking && locationName && (
          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full max-w-xs">
            <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="truncate text-xs">
              {truncateLocationName(locationName)}
            </span>
          </div>
        )}

        {/* Status indicator button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group"
          title={getTooltipText()}
        >
          <div className={`w-[10px] h-[10px] rounded-full ${getIconColor()}`} />

          {/* Mobile location name tooltip */}
          {isTracking && locationName && (
            <div className="sm:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {truncateLocationName(locationName, 40)}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </button>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLocationNameChange={handleLocationNameChange}
      />
    </>
  );
}