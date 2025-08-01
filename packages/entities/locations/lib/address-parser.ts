/**
 * Утилита для парсинга адресов в формате:
 * "номер дома, улица, район, город, индекс, страна"
 * 
 * Примеры:
 * - "4, Гоголя улица, Свердловский район, город Бишкек, 720021, Киргизия"
 * - "Гоголя улица, Свердловский район, город Бишкек, 720021, Киргизия"
 * - "Свердловский район, город Бишкек, 720021, Киргизия"
 */

export interface AddressComponents {
  houseNumber: string;
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  region: string;
}

export function parseAddress(fullAddress: string): AddressComponents {
  if (!fullAddress) {
    return {
      houseNumber: '',
      street: '',
      district: '',
      city: '',
      postalCode: '',
      country: '',
      region: '',
    };
  }

  const parts = fullAddress.split(',').map(part => part.trim());
  
  // Инициализируем все поля
  let houseNumber = '';
  let street = '';
  let district = '';
  let city = '';
  let postalCode = '';
  let country = '';
  let region = '';

  // Определяем компоненты по позиции и ключевым словам
  parts.forEach((part, index) => {
    if (index === 0) {
      // Первая часть - может быть номер дома + улица или просто улица
      if (/^\d+/.test(part)) {
        // Начинается с цифры - это номер дома + улица
        const match = part.match(/^(\d+[а-яА-Я]?)\s*,?\s*(.+)/);

        if (match) {
          houseNumber = match[1];
          street = match[2];
        } else {
          houseNumber = part;
        }
      } else {
        // Не начинается с цифры - это улица
        street = part;
      }
    } else if (part.includes('улица') || part.includes('проспект') || part.includes('переулок')) {
      // Это улица (если не была определена в первой части)
      if (!street) {
        street = part;
      }
    } else if (part.includes('район')) {
      district = part;
      region = part; // район также является регионом
    } else if (part.includes('город') || part.includes('Бишкек')) {
      city = part.replace('город ', '').trim();
    } else if (/^\d{6}$/.test(part)) {
      // 6 цифр подряд - это индекс
      postalCode = part;
    } else if (part.includes('Киргизия') || part.includes('Кыргызстан')) {
      country = part;
    }
  });

  // Если город не найден, но есть "Бишкек" в строке
  if (!city && fullAddress.includes('Бишкек')) {
    city = 'Бишкек';
  }

  // Если страна не найдена, но есть "Киргизия" или "Кыргызстан"
  if (!country) {
    if (fullAddress.includes('Киргизия')) {
      country = 'Киргизия';
    } else if (fullAddress.includes('Кыргызстан')) {
      country = 'Кыргызстан';
    }
  }

  return {
    houseNumber,
    street,
    district,
    city,
    postalCode,
    country,
    region,
  };
}

/**
 * Форматирует компоненты адреса обратно в строку
 */
export function formatAddress(components: Partial<AddressComponents>): string {
  const parts: string[] = [];
  
  if (components.houseNumber && components.street) {
    parts.push(`${components.houseNumber}, ${components.street}`);
  } else if (components.street) {
    parts.push(components.street);
  }
  
  if (components.district) {
    parts.push(components.district);
  }
  
  if (components.city) {
    const cityPart = components.city.includes('город') ? components.city : `город ${components.city}`;
    
    parts.push(cityPart);
  }
  
  if (components.postalCode) {
    parts.push(components.postalCode);
  }
  
  if (components.country) {
    parts.push(components.country);
  }
  
  return parts.join(', ');
}
