'use client';

import React from 'react';
import Lottie from 'lottie-react';
import cameraAnimation from '@shared/animated/lottie/CameraIcon.json';

interface PhotoReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoReceiptModal: React.FC<PhotoReceiptModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backdropFilter: 'blur(10.782177925109863px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <div 
        className="bg-white rounded-[24px] flex flex-col items-center justify-center"
        style={{
          height: '140px',
          paddingTop: '32px',
          paddingRight: '40px',
          paddingBottom: '32px',
          paddingLeft: '40px',
          minWidth: '400px',
        }}
      >
        {/* GIF камеры */}
        <div className="mb-4">
          <Lottie
            animationData={cameraAnimation}
            loop={true}
            autoplay={true}
            style={{ width: '60px', height: '60px' }}
          />
        </div>
        
        {/* Текст */}
        <p className="text-center text-gray-800 text-lg font-medium">
          Сфотографируйте чек, чтобы<br/>
          не потерять информацию о поездке
        </p>
      </div>
    </div>
  );
};
