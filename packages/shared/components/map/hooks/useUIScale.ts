'use client';

import { useState, useEffect } from 'react';
import { getUIScale } from '../utils';

/**
 * Хук для отслеживания масштаба UI
 */
export const useUIScale = () => {
  const [uiScale, setUiScale] = useState(1);

  useEffect(() => {
    setUiScale(getUIScale());

    // Отслеживаем изменения масштаба
    const observer = new MutationObserver(() => {
      setUiScale(getUIScale());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => observer.disconnect();
  }, []);

  return uiScale;
};
