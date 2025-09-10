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

      // Настройки шрифтов (умеренно увеличенные размеры)
      const fontFamily = 'Arial, sans-serif';
      const titleFont = `bold ${11 * dpi}px ` + fontFamily; // 22px для заголовка
      const headerFont = `bold ${16 * dpi}px ` + fontFamily;
      const normalFont = `${12 * dpi}px ` + fontFamily; // Уменьшили с 14px до 12px
      const smallFont = `${10 * dpi}px ` + fontFamily; // Уменьшили с 12px до 10px

      // Загружаем логотип
      const logoImg = new Image();
      logoImg.onload = () => {
        try {
          // Вычисляем высоту на основе содержимого
          let currentY = padding;

          // Логотип (максимальная высота 80px с учетом DPI)
          const logoHeight = Math.min(80 * dpi, logoImg.height * (contentWidth / logoImg.width));
          const logoWidth = contentWidth;

          // Заголовок
          ctx.font = titleFont;
          const titleHeight = 14 * dpi;

          // Подзаголовок
          ctx.font = headerFont;
          const subtitleHeight = 20 * dpi;

          // Основной контент
          ctx.font = normalFont;
          const lineHeight = 18 * dpi; // Уменьшили с 20px до 18px
          const smallLineHeight = 16 * dpi; // Уменьшили с 18px до 16px

          // Подсчитываем количество строк (используем специальные символы отступов)
          const lines = [
            '⠀', // невидимый символ отступа
            '⠀', // невидимый символ отступа
            '⠀', // невидимый символ отступа
            '⠀', // невидимый символ отступа
            { type: 'field', label: 'Дата:', value: ` ${data.date} ${data.time}` },
            '⠀', // невидимый символ отступа
            { type: 'field', label: 'Водитель:', value: " " + data.driver.fullName },
            '⠀', // невидимый символ отступа
            data.driver.phoneNumber ? { type: 'field', label: 'Телефон:', value: " " +  data.driver.phoneNumber } : '⠀',
            '⠀', // невидимый символ отступа
            { type: 'field', label: 'Тариф:', value: " " + data.route },
            '⠀', // невидимый символ отступа
            { type: 'field', label: 'Марка:', value: " " + data.car.make },
            '⠀', // невидимый символ отступа
            { type: 'field', label: 'Цвет авто:', value: " " + data.car.color },
            '⠀', // невидимый символ отступа
            { type: 'field', label: 'Номер авто:', value: " " + data.car.licensePlate },
            '⠀', // невидимый символ отступа
            data.queueNumber ? { type: 'field', label: 'Код:', value: " " + data.queueNumber } : '⠀',
            // '━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━',
            '- - - - - - - - - - - - - - - - - - - - -',
            '⠀', // невидимый символ отступа
            '⠀', // невидимый символ отступа
            { type: 'field', label: 'Покупка:', value: `${" " + data.price.toFixed(2)} KGZ` },
            '⠀', // невидимый символ отступа
            '⠀', // невидимый символ отступа
            '⠀'  // невидимый символ отступа
          ];

          // Вычисляем общую высоту (увеличиваем отступы)
          const totalHeight = padding + logoHeight + (40 * dpi) + // логотип + большой отступ
            titleHeight + (20 * dpi) + // заголовок "Контрольно-кассовый чек" + отступ
            lines.length * lineHeight + // строки
            (padding * 2); // увеличенный нижний отступ

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
          currentY += logoHeight + (40 * dpi);

          // Подзаголовок "Контрольно-кассовый чек"
          ctx.font = titleFont;
          ctx.fillText('Контрольно-кассовый чек', (receiptWidth / dpi) / 2, currentY / dpi);
          currentY += titleHeight + (20 * dpi);

          // Основной контент
          ctx.textAlign = 'left';
          ctx.font = normalFont;

          for (const line of lines) {
            if (typeof line === 'string') {
              if (line.includes('━━')) {
                // Рисуем пунктирную линию
                ctx.font = smallFont;
                ctx.fillText(line, padding / dpi, currentY / dpi);
                currentY += lineHeight;
              } else if (line === '⠀' || line === ' ' || line.trim() === '') {
                // Невидимый символ отступа - увеличиваем Y на 1.25x высоты строки для умеренных отступов
                currentY += lineHeight * 1.25;
              } else {
                ctx.font = normalFont;
                ctx.fillText(line, padding / dpi, currentY / dpi);
                currentY += lineHeight;
              }
            } else if (line && typeof line === 'object' && line.type === 'field') {
              // Рисуем поле с жирным названием и обычным значением
              const field = line as { type: string; label: string; value: string };
              
              // Сначала рисуем жирное название поля
              ctx.font = `bold ${12 * dpi}px ` + fontFamily;
              ctx.fillText(field.label, padding / dpi, currentY / dpi);
              
              // Вычисляем ширину названия поля для позиционирования значения
              const labelWidth = ctx.measureText(field.label).width;
              const valueX = (padding / dpi) + labelWidth;
              
              // Затем рисуем обычное значение
              ctx.font = normalFont;
              ctx.fillText(field.value, valueX, currentY / dpi);
              
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
