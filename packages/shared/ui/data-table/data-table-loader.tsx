import React from 'react';
import { Spinner } from '../feedback/spinner';

interface DataTableLoaderProps {
  /** Показывать ли индикатор загрузки */
  loading: boolean;
  /** Название сущности для отображения в сообщении о загрузке */
  entityName?: string;
  /** Дочерние элементы (содержимое таблицы) */
  children: React.ReactNode;
}

/**
 * Общий компонент для отображения состояния загрузки в таблицах
 * Показывает спиннер поверх содержимого таблицы
 */
export function DataTableLoader({ 
  loading, 
  entityName = 'данных',
  children 
}: DataTableLoaderProps) {
  return (
    <div className="relative">
      {children}
      
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-3">
            <Spinner size="lg" variant="primary" />
            <p className="text-sm text-muted-foreground">
              Загрузка {entityName}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
