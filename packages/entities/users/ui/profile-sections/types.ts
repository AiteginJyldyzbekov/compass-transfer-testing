import type { GetUserSelfProfileDTO, GetOperatorDTO, GetDriverDTO, GetCustomerDTO, GetAdminDTO, GetPartnerDTO, GetTerminalDTO } from '@entities/users/interface';

// Универсальный тип для всех пользователей
export type AnyUserProfile = GetUserSelfProfileDTO | GetOperatorDTO | GetDriverDTO | GetCustomerDTO | GetAdminDTO | GetPartnerDTO | GetTerminalDTO;

// Тип для данных карты
export interface MapSheetData {
  address: string;
  latitude?: number;
  longitude?: number;
  title?: string;
}

export interface RoleSpecificSectionProps {
  profile: AnyUserProfile;
}

export interface SectionWithMapProps {
  profile: AnyUserProfile;
  openMapSheet: (data: MapSheetData) => void;
}
