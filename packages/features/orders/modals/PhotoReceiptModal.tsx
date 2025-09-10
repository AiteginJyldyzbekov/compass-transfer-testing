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
      <div className="flex flex-col items-center justify-center">
        {/* Белый контейнер только для текста */}
        <div 
          className="bg-white rounded-[24px] flex items-center justify-center mb-8"
          style={{
            height: '280px', // Высота только для текста
            paddingTop: '56px', // 8px × 7
            paddingRight: '140px', // 20px × 7
            paddingBottom: '56px', // 8px × 7
            paddingLeft: '140px', // 20px × 7
            width: '80%', // 80% ширины экрана вместо фиксированной ширины
            maxWidth: '1200px', // Максимальная ширина
          }}
        >
          {/* Текст */}
          <p className="text-center text-gray-800 text-[28px] font-medium">
            Сфотографируйте чек, чтобы<br/>
            не потерять информацию о поездке
          </p>
        </div>
        
        {/* Камера отдельно, без белого контейнера */}
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
