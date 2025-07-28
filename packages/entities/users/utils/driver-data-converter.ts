import { CitizenshipCountry, EmploymentType, ServiceClass } from '../enums';

/**
 * Конвертирует API данные водителя в формат формы
 */
export function convertDriverApiToFormData(apiData: any) {
  // Конвертируем citizenshipCountry
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
      case 'FullTime':
        employmentType = EmploymentType.FullTime;
        break;
      case 'PartTime':
        employmentType = EmploymentType.PartTime;
        break;
      case 'Contractor':
        employmentType = EmploymentType.Contractor;
        break;
      case 'Freelancer':
        employmentType = EmploymentType.Freelancer;
        break;
      case 'SelfEmployed':
        employmentType = EmploymentType.SelfEmployed;
        break;
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
export function convertDriverFormToApiData(formData: any) {
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
      case EmploymentType.FullTime:
        apiEmploymentType = 'FullTime';
        break;
      case EmploymentType.PartTime:
        apiEmploymentType = 'PartTime';
        break;
      case EmploymentType.Contractor:
        apiEmploymentType = 'Contractor';
        break;
      case EmploymentType.Freelancer:
        apiEmploymentType = 'Freelancer';
        break;
      case EmploymentType.SelfEmployed:
        apiEmploymentType = 'SelfEmployed';
        break;
      default:
        apiEmploymentType = 'Fixed';
    }
  }

  return {
    apiEmploymentType,
  };
}
