import { cn } from '@shared/lib/utils';

interface ChapterHeaderProps {
  number: number;
  title: string;
  status: 'complete' | 'warning' | 'error' | 'pending';
  className?: string;
}

export function ChapterHeader({ 
  number, 
  title, 
  status, 
  className 
}: ChapterHeaderProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'complete':
        return 'text-green-600 border-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 border-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 border-red-600 bg-red-50';
      default:
        return 'text-gray-500 border-gray-300 bg-white';
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Заголовок главы */}
      <div className="flex items-center gap-3">
        {/* Номер главы */}
        <div className={cn(
          'relative flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors',
          getStatusColor()
        )}>
          {number}
        </div>
        
        {/* Название главы */}
        <h2 className={cn(
          'text-lg font-semibold transition-colors',
          status === 'complete' ? 'text-green-700' : 
          status === 'warning' ? 'text-yellow-700' :
          status === 'error' ? 'text-red-700' : 
          'text-gray-700'
        )}>
          {title}
        </h2>
        
        {/* Пунктирная линия справа */}
        <div className="flex-1 border-b border-dashed border-gray-300 ml-4" />
      </div>
    </div>
  );
}

