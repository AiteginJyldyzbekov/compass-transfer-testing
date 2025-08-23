import React from 'react';

interface MapPointIconProps {
  /** Цвет заливки значка   */
  color?: string;
  /** Номер точки (A-F / 1-5) */
  label?: string | number;
  /** Размер иконки (px) */
  size?: number;
  /** Дополнительный класс */
  className?: string;
}

/**
 * SVG-значок маркера для карты
 * Принимает цвет, размер и опциональную подпись (цифру/букву) поверх значка
 */
export const MapPointIcon: React.FC<MapPointIconProps> = ({
  color = '#3b82f6',
  label,
  size = 24,
  className = '',
}) => {
  return (
    <div
      style={{ position: 'relative', width: size, height: size }}
      className={className}
    >
      {/* Сам SVG-пин */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill={color}
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.5 6.5a5.5 5.5 0 1 0-11 0c0 4.5 5 8.5 5 8.5h1s5-4 5-8.5M8 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
        />
      </svg>
      {/* Подпись-номер */}
      {label !== undefined && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: Math.floor(size / 2.3),
            fontWeight: 600,
            pointerEvents: 'none',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default MapPointIcon; 