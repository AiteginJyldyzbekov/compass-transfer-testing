import L from 'leaflet';

/**
 * Кэш для иконок маркеров
 */
const pinIconCache = new Map<string, L.DivIcon>();

/**
 * Получает цвет маркера по типу точки
 */
export const getColorByType = (type?: string): string => {
  switch (type) {
    case 'start':
      return '#22c55e';
    case 'end':
      return '#ef4444';
    case 'driver':
      return '#3b82f6';
    case 'waypoint':
      return '#f59e0b';
    case 'location':
    default:
      return '#8b5cf6';
  }
};

/**
 * Получает цвет по классу обслуживания
 */
export const getServiceClassColor = (serviceClass: string): string => {
  switch (serviceClass) {
    case 'Economy':
      return '#9CA3AF'; // Серый - эконом
    case 'Comfort':
      return '#60A5FA'; // Синий - комфорт
    case 'ComfortPlus':
      return '#3B82F6'; // Темно-синий - комфорт+
    case 'Business':
      return '#8B5CF6'; // Фиолетовый - бизнес
    case 'Premium':
      return '#F59E0B'; // Оранжевый - премиум
    case 'Vip':
      return '#EF4444'; // Красный - VIP
    case 'Luxury':
      return '#DC2626'; // Темно-красный - люкс
    default:
      return '#8EBFFF';
  }
};

/**
 * Создает простую цветную иконку-булавку с буквой
 */
export const createPinIcon = (fill: string, label?: string | number, uiScale: number = 1): L.DivIcon => {
  const key = `${fill}|${label ?? ''}|${uiScale}`;
  
  const cached = pinIconCache.get(key);
  if (cached) return cached;

  // Масштабируем размеры иконки
  const scaledSize = Math.round(32 * uiScale);
  const scaledBorder = Math.round(3 * uiScale);
  const scaledFontSize = Math.round(16 * uiScale);

  // Создаем простую цветную букву без фоновой иконки
  const html = `
    <div style="
      width: ${scaledSize}px;
      height: ${scaledSize}px;
      background-color: ${fill};
      border: ${scaledBorder}px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${scaledFontSize}px;
      color: white;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ${label || ''}
    </div>
  `;

  const icon = L.divIcon({
    html,
    className: '',
    iconSize: [scaledSize, scaledSize],
    iconAnchor: [scaledSize / 2, scaledSize / 2],
    popupAnchor: [0, -scaledSize / 2 - 4],
  });

  pinIconCache.set(key, icon);
  return icon;
};

/**
 * Создает иконку автомобиля для водителя
 */
export const createDriverIcon = (
  serviceClass: string,
  isSelected: boolean = false,
  rotation: number = 0,
  uiScale: number = 1,
): L.DivIcon => {
  const fillColor = isSelected ? '#22C55E' : getServiceClassColor(serviceClass);
  const selectedStyle = isSelected ? 'filter: drop-shadow(0 0 8px #22c55e);' : '';
  const rotationStyle = rotation !== 0 ? `transform: rotate(${rotation}deg);` : '';

  // Масштабируем размеры иконки автомобиля
  const scaledWidth = Math.round(56 * uiScale);
  const scaledHeight = Math.round(32 * uiScale);

  const carSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 24" fill="none" width="${scaledWidth}" height="${scaledHeight}" style="${selectedStyle} ${rotationStyle} transform-origin: center;">
      <g clip-path="url(#clip0_42_2510)">
        <path d="M11.7415 5.22881C11.8153 4.34825 11.3567 3.34659 12.6569 3.01606L12.7498 5.027C14.4654 4.66129 16.0866 4.32077 17.7056 3.96753C20.0512 3.4575 22.4009 2.9697 24.733 2.40747C25.638 2.16049 26.5238 1.84568 27.3832 1.46561C30.2331 0.298448 33.2233 0.235652 36.2282 0.285838C36.9767 0.299309 37.471 0.750296 37.8466 1.38123C38.9376 3.20844 39.5421 5.23256 39.9148 7.29461C40.283 9.32646 40.4181 11.4059 40.5761 13.4698C40.674 14.7074 40.1256 15.5987 38.9536 16.0914C36.0574 17.3071 33.162 18.3387 29.9513 18.5157C27.4256 18.6547 24.926 19.3607 22.4247 19.8603C20.3821 20.2747 18.3515 20.7478 16.2235 21.2158L16.836 23.0363C16.0758 23.2122 16.0758 23.2122 15.0326 21.3316C13.962 21.7123 12.8791 22.2313 11.7456 22.4725C10.1125 22.8264 8.53393 23.5459 6.78885 23.3079C6.35022 23.2481 5.87241 23.4607 5.41619 23.5634C4.48482 23.7664 3.46457 23.3685 3.11709 22.4642C2.30821 20.3614 1.34025 18.2772 0.888129 16.0908C0.431324 13.871 0.472913 11.5449 0.381643 9.26176C0.33822 8.32098 1.06987 7.62934 2.00073 7.38149C3.84511 6.88339 5.66651 6.29513 7.52494 5.86361C8.64497 5.60383 9.81481 5.57383 10.9542 5.4268C11.2204 5.37737 11.4833 5.31126 11.7415 5.22881ZM17.2852 7.05379C15.6778 7.01434 14.2232 6.91981 12.7698 6.95487C10.9704 7.00111 10.5394 7.51561 10.5478 9.36078C10.5377 9.65339 10.556 9.94635 10.6023 10.2354C11.0815 12.6015 11.5422 14.9732 12.0866 17.325C12.2374 17.9775 12.6062 18.596 12.9562 19.1817C13.3386 19.8219 13.9723 20.0664 14.6519 19.7757C16.2725 19.083 17.8666 18.326 19.5297 17.5689C17.8466 14.1892 17.1703 10.7806 17.2852 7.05537L17.2852 7.05379ZM31.7694 14.8319C33.2584 14.5503 34.5568 14.3159 35.8493 14.0562C36.4225 13.9401 36.7368 13.5478 36.8239 12.9548C37.3243 9.82571 36.6332 6.61749 34.8923 3.98739C34.6945 3.67639 34.129 3.38236 33.7933 3.44588C32.4228 3.6804 31.0758 4.05149 29.5778 4.41035C31.221 7.7407 31.9583 11.0777 31.7695 14.8335L31.7694 14.8319ZM30.5847 3.32986L30.517 3.05287C27.326 2.91043 24.2295 3.52235 21.0804 4.28875C21.2131 4.88767 21.3317 5.41842 21.4754 6.05205L30.5847 3.32986ZM24.0576 18.4484C26.7556 18.0662 32.3728 16.5248 33.1672 15.3932L23.6954 16.7156L24.0576 18.4484ZM20.4873 4.38016L13.7881 5.78261C16.123 6.12942 18.4335 6.42295 20.8603 6.14287C20.7244 5.50888 20.6121 4.97785 20.4859 4.38343L20.4873 4.38016ZM16.7459 19.9303L16.8581 20.1525L23.4907 18.633C23.358 17.9989 23.2453 17.4599 23.0884 16.7116L16.7459 19.9303Z" fill="${fillColor}"/>
        <path d="M17.2847 7.05528C17.1698 10.7805 17.8461 14.1891 19.5293 17.5704C17.8662 18.3275 16.2721 19.0845 14.6515 19.7772C13.9719 20.0679 13.3381 19.8234 12.9558 19.1832C12.6058 18.5975 12.237 17.979 12.0862 17.3265C11.5417 14.9747 11.0842 12.6028 10.6018 10.2369C10.5555 9.94786 10.5373 9.6549 10.5473 9.36228C10.539 7.51711 10.97 7.00262 12.7693 6.95638C14.2227 6.92131 15.6774 7.01582 17.2847 7.05528Z" fill="white"/>
        <path d="M31.7696 14.8334C31.9585 11.0776 31.2212 7.7406 29.578 4.41185C31.0761 4.05459 32.423 3.6819 33.7935 3.44738C34.1295 3.39025 34.6949 3.68267 34.8925 3.98888C36.6334 6.61899 37.3245 9.82719 36.8241 12.9562C36.737 13.5493 36.4225 13.9352 35.8496 14.0577C34.557 14.3174 33.2587 14.5518 31.7696 14.8334Z" fill="white"/>
        <path d="M30.5845 3.32976L21.472 6.0505C21.3314 5.41672 21.2129 4.88597 21.077 4.2872C24.2261 3.52239 27.3227 2.91047 30.5136 3.05131L30.5845 3.32976Z" fill="white"/>
        <path d="M24.0556 18.4516L23.6949 16.7187L33.1667 15.3963C32.371 16.5327 26.7537 18.0725 24.0556 18.4516Z" fill="white"/>
        <path d="M20.4857 4.38333C20.6119 4.97775 20.7242 5.50879 20.8587 6.14605C18.4316 6.41814 16.1214 6.1326 13.7865 5.78578L20.4857 4.38333Z" fill="white"/>
        <path d="M16.7446 19.9335L23.0887 16.7147C23.244 17.463 23.3563 17.9941 23.491 18.6361L16.8584 20.1556L16.7446 19.9335Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_42_2510">
          <rect width="40" height="22" fill="white" transform="translate(40.9717 21.9766) rotate(177.357)"/>
        </clipPath>
      </defs>
    </svg>
  `;

  return L.divIcon({
    html: carSvg,
    className: 'driver-marker',
    iconSize: [scaledWidth, scaledHeight],
    iconAnchor: [scaledWidth / 2, scaledHeight / 2],
    popupAnchor: [0, -scaledHeight / 2 - 13],
  });
};
