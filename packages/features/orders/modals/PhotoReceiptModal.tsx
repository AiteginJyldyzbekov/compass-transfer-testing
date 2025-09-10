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
            height: '140px', // Уменьшенная высота
            paddingTop: '32px', // Уменьшенные отступы
            paddingRight: '40px',
            paddingBottom: '32px',
            paddingLeft: '40px',
            width: '80%', // 80% ширины экрана
            maxWidth: '800px', // Уменьшенная максимальная ширина
          }}
        >
          {/* Текст */}
          <p className="text-center text-gray-800 text-[32px] font-medium">
            Сфотографируйте чек,<br/>
            чтобы не потерять информацию о поездке
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
