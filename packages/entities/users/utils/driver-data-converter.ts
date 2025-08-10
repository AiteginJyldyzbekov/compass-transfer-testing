import { CitizenshipCountry, EmploymentType, ServiceClass } from '../enums';
import type { GetDriverDTO } from '../interface';

/**
 * Конвертирует данные из API в формат для формы
 */
export function convertDriverApiToFormData(apiData: Partial<GetDriverDTO>) {
  // Поле страны гражданства
  let citizenshipCountry = CitizenshipCountry.KG; // default

  if (apiData.profile?.citizenshipCountry) {
    const countryValue = apiData.profile.citizenshipCountry;

    if (Object.values(CitizenshipCountry).includes(countryValue)) {
      citizenshipCountry = countryValue as CitizenshipCountry;
    }
  }

  // Конвертируем employmentType
  let employmentType = EmploymentType.FixedAmount; // default

  if (apiData.employment?.employmentType) {
    const typeValue = apiData.employment.employmentType;
    // Маппинг API значений в enum

    switch (typeValue) {
      case 'Fixed':
        employmentType = EmploymentType.FixedAmount;
        break;
      case 'Percentage':
        employmentType = EmploymentType.Percentage;
        break;
      // Все остальные типы трудоустройства будут обрабатываться в default
      default:
        employmentType = EmploymentType.FixedAmount;
    }
  }

  // Конвертируем preferredRideTypes
  let preferredRideTypes: ServiceClass[] = [];

  if (apiData.profile?.preferredRideTypes) {
    preferredRideTypes = apiData.profile.preferredRideTypes.map((type: string) => {
      if (Object.values(ServiceClass).includes(type as ServiceClass)) {
        return type as ServiceClass;
      }

      return ServiceClass.Economy; // fallback
    });
  }

  return {
    citizenshipCountry,
    employmentType,
    preferredRideTypes,
  };
}

/**
 * Конвертирует данные формы в API формат
 */
export function convertDriverFormToApiData(formData: Partial<GetDriverDTO>) {
  // Конвертируем employmentType обратно в API формат
  let apiEmploymentType = 'Fixed'; // default
  
  if (formData.employment?.employmentType) {
    switch (formData.employment.employmentType) {
      case EmploymentType.FixedAmount:
        apiEmploymentType = 'Fixed';
        break;
      case EmploymentType.Percentage:
        apiEmploymentType = 'Percentage';
        break;
      default:
        apiEmploymentType = 'Fixed';
    }
  }

  return {
    apiEmploymentType,
  };
}
