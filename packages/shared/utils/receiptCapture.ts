/**
 * Утилита для создания растрового изображения чека
 */

import html2canvas from 'html2canvas';
import { toast } from '@shared/lib/conditional-toast';

/**
 * Создает скриншот элемента и возвращает его как base64
 * @param elementId - ID элемента для скриншота
 * @param maxWidth - максимальная ширина изображения (по умолчанию 384px для фискальных принтеров)
 * @returns Promise<string> - изображение в формате base64
 */
export const captureReceiptImage = async (
  elementId: string,
  maxWidth: number = 384
): Promise<string> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Элемент с ID ${elementId} не найден`);
  }

  try {
    // Дожидаемся полного рендера для максимального качества
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Создаем скриншот элемента с оптимальным качеством
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Оптимальное соотношение качества и производительности
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      removeContainer: true,
      imageTimeout: 15000,
      logging: false,
      // letterRendering: true, // Свойство не поддерживается в текущей версии html2canvas
      // pixelRatio: 2, // Свойство не поддерживается в текущей версии html2canvas
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      ignoreElements: (element) => {
        const htmlElement = element as HTMLElement;

        return element.tagName === 'SCRIPT' || htmlElement.style?.display === 'none';
      },
    });

    // Изменяем размер если нужно
    const resizedCanvas = document.createElement('canvas');
    const ctx = resizedCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Не удалось получить контекст canvas');
    }

    // Вычисляем новые размеры с сохранением пропорций
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    const aspectRatio = originalHeight / originalWidth;
    
    const newWidth = Math.min(maxWidth, originalWidth);
    const newHeight = Math.round(newWidth * aspectRatio);
    
    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;
    
    // Настраиваем контекст для лучшего качества
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newWidth, newHeight);
    
    // Рисуем изображение с лучшим качеством
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

    // Возвращаем base64 с максимальным качеством
    const base64 = resizedCanvas.toDataURL('image/png', 1.0).split(',')[1];
  
    return base64;
  } catch (error) {
    toast.error('❌ Ошибка создания скриншота чека:');
    throw new Error(`Не удалось создать изображение чека: ${error instanceof Error ? error.message : String(error)}`);
  }
};
