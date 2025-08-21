'use client';

import { MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { LocationModal } from './location-modal';
import { useLocation } from './location-provider';

export function LocationHeaderIcon() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTracking, error, permissionStatus } = useLocation();

  const getIconColor = () => {
    if (error || permissionStatus === 'denied') return 'text-red-500';
    if (isTracking) return 'text-green-500';

    return 'text-gray-400';
  };

  const getTooltipText = () => {
    if (error) return 'Ошибка геолокации';
    if (permissionStatus === 'denied') return 'Геолокация запрещена';
    if (isTracking) return 'Геолокация активна';

    return 'Геолокация отключена';
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        title={getTooltipText()}
      >
        <MapPin className={`w-5 h-5 ${getIconColor()}`} />
      </button>

      <LocationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
