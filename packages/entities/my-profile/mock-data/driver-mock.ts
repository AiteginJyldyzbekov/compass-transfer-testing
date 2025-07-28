import {
  Role,
  ActivityStatus,
  CitizenshipCountry,
  ServiceClass,
  IdentityDocumentType,
} from '@entities/users/enums';
import type { GetUserSelfProfileDriverDTO } from '@entities/users/interface';

export const mockDriverProfile: GetUserSelfProfileDriverDTO = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  email: 'driver@compass.local',
  role: Role.Driver,
  phoneNumber: '+996 555 987 654',
  fullName: 'Иванов Иван Иванович',
  avatarUrl: null,
  online: false,
  lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
  status: ActivityStatus.Active,
  locationId: '550e8400-e29b-41d4-a716-446655440301', // ID текущей локации водителя
  profile: {
    licenseNumber: 'AB1234567',
    licenseCategories: ['B', 'C'],
    licenseIssueDate: '2020-05-10T00:00:00Z',
    licenseExpiryDate: '2030-05-10T00:00:00Z',
    dateOfBirth: '1985-03-15T00:00:00Z',
    birthPlace: 'г. Бишкек',
    citizenship: 'Кыргызстан',
    citizenshipCountry: CitizenshipCountry.KG,
    drivingExperience: 8,
    languages: ['Кыргызский', 'Русский', 'Английский'],
    taxIdentifier: '12345678901234',
    totalRides: 1250,
    totalDistance: 45000,
    lastRideDate: '2024-01-20T14:30:00Z',
    medicalExamDate: '2023-12-01T00:00:00Z',
    backgroundCheckDate: '2023-11-15T00:00:00Z',
    profilePhoto: null,
    preferredRideTypes: [ServiceClass.Economy, ServiceClass.Comfort],
    preferredWorkZones: [
      '550e8400-e29b-41d4-a716-446655440102', // Центр города
      '550e8400-e29b-41d4-a716-446655440104', // Восточный район
      '550e8400-e29b-41d4-a716-446655440105', // Западный район
    ],
    trainingCompleted: true,
    passport: {
      number: 'ID1234567',
      series: 'AN',
      issueDate: '2020-01-15T00:00:00Z',
      issuedBy: 'МВД КР',
      page: null,
      expiryDate: '2030-01-15T00:00:00Z',
      identityType: IdentityDocumentType.NationalPassport,
    },
    workExperience: [
      {
        employerName: 'Такси Элит',
        position: 'Водитель',
        startDate: '2018-01-01T00:00:00Z',
        endDate: '2022-12-31T00:00:00Z',
        isCurrent: false,
        responsibilities: 'Работа водителем в службе такси',
      },
    ],
    education: [
      {
        institution: 'Автошкола "Профи"',
        degree: 'Водительские курсы',
        fieldOfStudy: 'Вождение автомобиля',
        startDate: '2019-09-01T00:00:00Z',
        endDate: '2019-11-30T00:00:00Z',
        isCompleted: true,
      },
    ],
    testScore: [
      {
        testName: 'Тест по ПДД',
        score: 95,
        maxPossibleScore: 100,
        passedDate: '2023-01-15T00:00:00Z',
        expiryDate: '2025-01-15T00:00:00Z',
        comments: 'Отличный результат',
      },
    ],
  },
};
