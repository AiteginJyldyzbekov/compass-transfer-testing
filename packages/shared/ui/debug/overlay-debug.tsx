'use client';

import { useEffect, useState } from 'react';

export function OverlayDebug() {
  const [overlays, setOverlays] = useState<Element[]>([]);

  useEffect(() => {
    const checkOverlays = () => {
      // Ищем все элементы с fixed позиционированием и высоким z-index
      const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);

        return style.position === 'fixed' && 
               (style.zIndex === '50' || style.zIndex === '100' || parseInt(style.zIndex) > 50);
      });
      
      setOverlays(fixedElements);
    };

    // Проверяем каждые 2 секунды
    const interval = setInterval(checkOverlays, 2000);
    
    checkOverlays(); // Первоначальная проверка

    return () => clearInterval(interval);
  }, []);

  if (overlays.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'red',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999,
        fontSize: '12px',
        maxWidth: '300px'
      }}
    >
      <div>🚨 Найдены overlay элементы:</div>
      {overlays.map((el, i) => (
        <div key={i}>
          {el.tagName} - z-index: {window.getComputedStyle(el).zIndex}
          <button 
            onClick={() => el.remove()}
            style={{ marginLeft: '5px', background: 'white', color: 'red' }}
          >
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}
