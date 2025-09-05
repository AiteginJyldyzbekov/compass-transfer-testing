/**
 * Утилита для генерации PNG изображения чека с логотипом и динамическими данными
 */

interface ReceiptData {
  orderNumber: string;
  date: string;
  time: string;
  driver: {
    fullName: string;
    phoneNumber?: string;
  };
  car: {
    make: string;
    model: string;
    licensePlate: string;
    color: string;
  };
  route: string;
  price: number;
  queueNumber?: string;
}

/**
 * Генерирует PNG изображение чека с логотипом и данными
 * @param logoBase64 - логотип в base64
 * @param data - данные чека
 * @returns Promise<string> - base64 PNG изображение чека
 */
export async function generateReceiptPNG(logoBase64: string, data: ReceiptData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Создаем canvas для генерации изображения
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Не удалось получить контекст canvas'));
        return;
      }

      // Размеры чека (384px ширина - стандарт для термопринтеров)
      // Увеличиваем DPI для лучшего качества печати
      const dpi = 2; // Увеличиваем в 2 раза для лучшего качества
      const receiptWidth = 384 * dpi;
      const padding = 16 * dpi;
      const contentWidth = receiptWidth - (padding * 2);
      
      // Настройки шрифтов (значительно увеличенные размеры)
      const fontFamily = 'Arial, sans-serif';
      const titleFont = `bold ${32 * dpi}px ` + fontFamily;
      const headerFont = `bold ${24 * dpi}px ` + fontFamily;
      const normalFont = `${18 * dpi}px ` + fontFamily;
      const smallFont = `${16 * dpi}px ` + fontFamily;

      // Загружаем логотип
      const logoImg = new Image();
      logoImg.onload = () => {
        try {
          // Вычисляем высоту на основе содержимого
          let currentY = padding;
          
          // Логотип (максимальная высота 120px с учетом DPI)
          const logoHeight = Math.min(120 * dpi, logoImg.height * (contentWidth / logoImg.width));
          const logoWidth = contentWidth;
          
          // Заголовок
          ctx.font = titleFont;
          const titleHeight = 40 * dpi;
          
          // Подзаголовок
          ctx.font = headerFont;
          const subtitleHeight = 30 * dpi;
          
          // Основной контент
          ctx.font = normalFont;
          const lineHeight = 24 * dpi;
          const smallLineHeight = 20 * dpi;
          
          // Подсчитываем количество строк
          const lines = [
            '',
            `Дата: ${data.date} ${data.time}`,
            '',
            `Водитель: ${data.driver.fullName}`,
            data.driver.phoneNumber ? `Телефон: ${data.driver.phoneNumber}` : '',
            '',
            `Тариф: ${data.route}`,
            '',
            `Марка: ${data.car.make}`,
            `Цвет авто: ${data.car.color}`,
            `Номер авто: ${data.car.licensePlate}`,
            data.queueNumber ? `Код: ${data.queueNumber}` : '',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '',
            `Покупка: ${data.price.toFixed(2)} KGZ`
          ].filter(line => line !== '');

          // Вычисляем общую высоту
          const totalHeight = padding + logoHeight + (30 * dpi) + // логотип + отступ
                              titleHeight + (16 * dpi) + // заголовок + отступ
                              subtitleHeight + (16 * dpi) + // подзаголовок + отступ
                              lines.length * lineHeight + // строки
                              padding; // нижний отступ

          // Устанавливаем размеры canvas с высоким DPI
          canvas.width = receiptWidth;
          canvas.height = totalHeight;
          
          // Масштабируем контекст для высокого DPI
          ctx.scale(dpi, dpi);

          // Белый фон
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width / dpi, canvas.height / dpi);

          // Сбрасываем контекст после изменения размеров
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';

          // Рисуем логотип
          ctx.drawImage(logoImg, padding / dpi, currentY / dpi, logoWidth / dpi, logoHeight / dpi);
          currentY += logoHeight + (30 * dpi);

          // Заголовок
          ctx.font = titleFont;
          ctx.fillText('COMPASS', (receiptWidth / dpi) / 2, currentY / dpi);
          currentY += titleHeight + (16 * dpi);

          ctx.font = headerFont;
          ctx.fillText('TRANSFER', (receiptWidth / dpi) / 2, currentY / dpi);
          currentY += subtitleHeight + (16 * dpi);

          // Подзаголовок
          ctx.font = normalFont;
          ctx.fillText('Контрольно-кассовый чек', (receiptWidth / dpi) / 2, currentY / dpi);
          currentY += lineHeight + (30 * dpi);

          // Основной контент
          ctx.textAlign = 'left';
          ctx.font = normalFont;

          for (const line of lines) {
            if (line.includes('━━')) {
              // Рисуем пунктирную линию
              ctx.font = smallFont;
              ctx.fillText(line, padding / dpi, currentY / dpi);
              currentY += lineHeight;
            } else if (line === '') {
              // Пустая строка - увеличиваем Y на половину высоты строки
              currentY += lineHeight / 2;
            } else {
              ctx.font = normalFont;
              ctx.fillText(line, padding / dpi, currentY / dpi);
              currentY += lineHeight;
            }
          }

          // Конвертируем в base64
          const pngBase64 = canvas.toDataURL('image/png');
          const base64Data = pngBase64.split(',')[1]; // Убираем префикс data:image/png;base64,
          
          resolve(base64Data);
        } catch (error) {
          reject(error);
        }
      };

      logoImg.onerror = () => {
        reject(new Error('Не удалось загрузить логотип'));
      };

      // Устанавливаем src для загрузки логотипа
      logoImg.src = `data:image/png;base64,${logoBase64}`;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Получает логотип и генерирует полный чек в PNG
 * @param data - данные чека
 * @returns Promise<string> - base64 PNG изображение чека
 */
export async function generateFullReceiptPNG(data: ReceiptData): Promise<string> {
  try {
    // Получаем логотип
    const logoResponse = await fetch('/entities/fiscal/icon/logo.png');
    if (!logoResponse.ok) {
      throw new Error('Не удалось загрузить логотип');
    }
    
    const logoBlob = await logoResponse.blob();
    const logoBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Убираем префикс
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(logoBlob);
    });

    // Генерируем чек
    return await generateReceiptPNG(logoBase64, data);
  } catch (error) {
    console.error('Ошибка генерации чека:', error);
    throw error;
  }
}
