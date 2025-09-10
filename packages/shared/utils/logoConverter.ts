/**
 * Утилита для конвертации логотипа в base64
 */

/**
 * Конвертирует изображение в base64
 * @param imagePath - путь к изображению
 * @returns Promise<string> - base64 строка
 */
export async function convertImageToBase64(imagePath: string): Promise<string> {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Убираем префикс "data:image/png;base64," если он есть
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Ошибка конвертации изображения в base64:', error);
    throw error;
  }
}

/**
 * Получает base64 логотипа из папки entities/fiscal/icon/logo.png
 * @returns Promise<string> - base64 строка логотипа
 */
export async function getLogoBase64(): Promise<string> {
  // Путь к логотипу относительно public папки
  const logoPath = '/entities/fiscal/icon/logo.png';
  return convertImageToBase64(logoPath);
}
