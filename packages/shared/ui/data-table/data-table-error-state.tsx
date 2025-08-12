import React from 'react';

interface DataTableErrorStateProps {
  /** Сообщение об ошибке */
  error: string;
  /** Функция для повторной попытки загрузки */
  onRetry: () => void;
  /** Название сущности для отображения в сообщении об ошибке */
  entityName?: string;
}

/**
 * Общий компонент для отображения ошибок загрузки в таблицах
 */
export function DataTableErrorState({ 
  error, 
  onRetry, 
  entityName = 'данных' 
}: DataTableErrorStateProps) {
  return (
    <div className='space-y-4'>
      <div className='text-center py-8'>
        <p className='text-red-600 mb-4'>
          Ошибка загрузки {entityName}: {error}
        </p>
        <button
          onClick={onRetry}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
