import React from 'react';

type LocationContainerProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: 'order' | 'payment';
  emptyMessage?: string; // Сообщение при пустом контейнере
  showEmptyMessage?: boolean; // Показывать ли сообщение о пустоте
};

const LocationContainer = ({ 
  children, 
  className, 
  variant, 
  emptyMessage = "Локации не найдены",
  showEmptyMessage = false 
}: LocationContainerProps) => {
  // Проверяем пустоту контейнера
  const isEmpty = !children || (React.Children.count(children) === 0);
  const shouldShowEmpty = isEmpty && showEmptyMessage;

  if (variant === 'order') {
    return (
      <div
        className={`bg-[#FFFFFF5C] border-solid border-[2px] border-[#FFFFFF] rounded-[32px] overflow-hidden ${className}`}
      >
        <div className="flex flex-col gap-6 p-12">
          {shouldShowEmpty ? (
            <p className="text-center text-[24px] text-[#666]">
              {emptyMessage}
            </p>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#FFFFFFB2] border-solid border-[2px] border-[#ECEEF4] rounded-[60px] overflow-y-auto ${className}`}
    >
      <div className="flex flex-col gap-6 p-12">
        {shouldShowEmpty ? (
          <p className="text-center text-[24px] text-[#666]">
            {emptyMessage}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default LocationContainer;
