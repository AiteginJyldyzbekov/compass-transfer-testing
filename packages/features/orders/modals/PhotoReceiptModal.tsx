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
        className="bg-white rounded-[168px] flex flex-col items-center justify-center"
        style={{
          height: '980px', // 140px × 7
          paddingTop: '224px', // 32px × 7
          paddingRight: '280px', // 40px × 7
          paddingBottom: '224px', // 32px × 7
          paddingLeft: '280px', // 40px × 7
          minWidth: '2800px', // 400px × 7
        }}
      >
        {/* Текст */}
        <p className="text-center text-gray-800 text-6xl font-medium mb-8">
          Сфотографируйте чек, чтобы<br/>
          не потерять информацию о поездке
        </p>
        
        {/* GIF камеры */}
        <div>
          <Lottie
            animationData={cameraAnimation}
            loop={true}
            autoplay={true}
            style={{ width: '420px', height: '420px' }} // 60px × 7
          />
        </div>
      </div>
    </div>
  );
};
