'use client';

import {
  Car,
  CreditCard,
  Shield,
  Briefcase,
  BookOpen,
  Award,
  FileText,
} from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { formatDate } from '@entities/my-profile';
import type { GetDriverDTO } from '@entities/users/interface';
import type { SectionWithMapProps } from '@entities/users/ui/profile-sections/types';
import { getServiceClassLabel, getLicenseCategoryLabel, getCitizenshipLabel } from '@entities/users/utils';
import { getLanguageLabel } from '@entities/users/utils/language-utils';

// Type guard для проверки водителя
function isDriverData(profile: SectionWithMapProps['profile']): profile is GetDriverDTO {
  return 'role' in profile && profile.role === 'Driver';
}

export function DriverSection({ profile, openMapSheet: _openMapSheet }: SectionWithMapProps) {
  if (!isDriverData(profile)) return null;

  const driverProfile = profile.profile;

  return (
    <div className='flex flex-col gap-6'>
      {/* Основная информация водителя */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Car className='h-5 w-5' />
            Информация водителя
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='border-l-4 border-blue-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Опыт вождения</label>
              <p className='text-sm font-medium'>{driverProfile.drivingExperience} лет</p>
            </div>

            <div className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Всего поездок</label>
              <p className='text-sm font-medium'>{driverProfile.totalRides}</p>
            </div>

            <div className='border-l-4 border-purple-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Общий пробег</label>
              <p className='text-sm font-medium'>
                {driverProfile.totalDistance.toLocaleString()} км
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='border-l-4 border-orange-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Дата рождения</label>
              <p className='text-sm'>{formatDate(driverProfile.dateOfBirth)}</p>
            </div>

            <div className='border-l-4 border-teal-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Место рождения</label>
              <p className='text-sm'>{driverProfile.birthPlace}</p>
            </div>
          </div>

          <div className='border-l-4 border-indigo-200 pl-4 flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted-foreground'>Гражданство</label>
            <p className='text-sm'>{getCitizenshipLabel(driverProfile.citizenship)}</p>
          </div>

          <div className='border-l-4 border-pink-200 pl-4 flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted-foreground'>Языки</label>
            <div className='flex flex-wrap gap-1'>
              {driverProfile.languages.map(language => (
                <Badge key={language} variant='secondary' className='text-xs w-fit'>
                  {getLanguageLabel(language)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Водительские права */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CreditCard className='h-5 w-5' />
            Водительские права
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='border-l-4 border-blue-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Номер прав</label>
              <p className='text-sm font-mono'>{driverProfile.licenseNumber}</p>
            </div>

            <div className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Категории водительского удостоверения</label>
              <div className='flex flex-wrap gap-1'>
                {driverProfile.licenseCategories.map(category => (
                  <Badge key={category} variant='outline' className='text-xs w-fit'>
                    {getLicenseCategoryLabel(category)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='border-l-4 border-purple-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Дата выдачи</label>
              <p className='text-sm'>{formatDate(driverProfile.licenseIssueDate)}</p>
            </div>

            <div className='border-l-4 border-orange-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Действительны до</label>
              <p className='text-sm'>{formatDate(driverProfile.licenseExpiryDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Паспортные данные */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            Паспортные данные
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Показываем номер паспорта только если он заполнен */}
            {driverProfile.passport.number && (
              <div className='border-l-4 border-blue-200 pl-4 flex flex-col gap-2'>
                <label className='text-sm font-medium text-muted-foreground'>Серия и номер</label>
                <p className='text-sm font-mono'>
                  {driverProfile.passport.series && `${driverProfile.passport.series} `}{driverProfile.passport.number}
                </p>
              </div>
            )}

            {/* Показываем дату выдачи только если она заполнена */}
            {driverProfile.passport.issueDate && (
              <div className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
                <label className='text-sm font-medium text-muted-foreground'>Дата выдачи</label>
                <p className='text-sm'>{formatDate(driverProfile.passport.issueDate)}</p>
              </div>
            )}

            {/* Показываем срок действия только если он заполнен */}
            {driverProfile.passport.expiryDate && (
              <div className='border-l-4 border-purple-200 pl-4 flex flex-col gap-2'>
                <label className='text-sm font-medium text-muted-foreground'>Действителен до</label>
                <p className='text-sm'>{formatDate(driverProfile.passport.expiryDate)}</p>
              </div>
            )}
          </div>

          {/* Показываем кем выдан только если заполнено */}
          {driverProfile.passport.issuedBy && (
            <div className='border-l-4 border-orange-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Кем выдан</label>
              <p className='text-sm'>{driverProfile.passport.issuedBy}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Опыт работы */}
      {driverProfile.workExperience && driverProfile.workExperience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Briefcase className='h-5 w-5' />
              Опыт работы
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {driverProfile.workExperience.map((work, index) => (
              <div key={index} className='border-l-4 border-blue-200 pl-4 flex flex-col gap-2'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex flex-col gap-1'>
                    <h4 className='font-medium'>{work.position}</h4>
                    <Badge variant='outline' className='text-xs w-fit'>
                      {work.isCurrent ? 'Текущее место' : 'Завершено'}
                    </Badge>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>{work.employerName}</p>
                <p className='text-xs text-muted-foreground'>
                  {formatDate(work.startDate)} -{' '}
                  {work.endDate ? formatDate(work.endDate) : 'настоящее время'}
                </p>
                {work.responsibilities && <p className='text-sm'>{work.responsibilities}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Образование */}
      {driverProfile.education && driverProfile.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5' />
              Образование
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {driverProfile.education.map((edu, index) => (
              <div key={index} className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex flex-col gap-1'>
                    <h4 className='font-medium'>{edu.degree}</h4>
                    <Badge variant='outline' className='text-xs w-fit'>
                      {edu.isCompleted ? 'Завершено' : 'В процессе'}
                    </Badge>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>{edu.institution}</p>
                <p className='text-sm'>{edu.fieldOfStudy}</p>
                <p className='text-xs text-muted-foreground'>
                  {formatDate(edu.startDate)} -{' '}
                  {edu.endDate ? formatDate(edu.endDate) : 'настоящее время'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Результаты тестов */}
      {driverProfile.testScore && driverProfile.testScore.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='h-5 w-5' />
              Результаты тестов
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {driverProfile.testScore.map((test, index) => (
              <div
                key={index}
                className='border-l-4 border-yellow-200 rounded-lg p-4 flex flex-col gap-2'
              >
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex flex-col gap-1'>
                    <h4 className='font-medium'>{test.testName}</h4>
                    <Badge variant='outline' className='text-xs w-fit'>
                      {test.score}/{test.maxPossibleScore}
                    </Badge>
                  </div>
                </div>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <span>Дата: {formatDate(test.passedDate)}</span>
                  {test.expiryDate && <span>Действителен до: {formatDate(test.expiryDate)}</span>}
                </div>
                {test.comments && <p className='text-sm'>{test.comments}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Дополнительная информация */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Дополнительная информация
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Показываем налоговый номер только если он заполнен */}
            {driverProfile.taxIdentifier && (
              <div className='border-l-4 border-blue-200 pl-4 flex flex-col gap-2'>
                <label className='text-sm font-medium text-muted-foreground'>Налоговый номер</label>
                <p className='text-sm font-mono'>{driverProfile.taxIdentifier}</p>
              </div>
            )}

            {/* Показываем последнюю поездку только если она есть */}
            {driverProfile.lastRideDate && (
              <div className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
                <label className='text-sm font-medium text-muted-foreground'>Последняя поездка</label>
                <p className='text-sm'>{formatDate(driverProfile.lastRideDate)}</p>
              </div>
            )}
          </div>

          {/* Показываем медосмотр и проверку данных только если они заполнены */}
          {(driverProfile.medicalExamDate || driverProfile.backgroundCheckDate) && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {driverProfile.medicalExamDate && (
                <div className='border-l-4 border-purple-200 pl-4 flex flex-col gap-2'>
                  <label className='text-sm font-medium text-muted-foreground'>Медосмотр</label>
                  <p className='text-sm'>{formatDate(driverProfile.medicalExamDate)}</p>
                </div>
              )}

              {driverProfile.backgroundCheckDate && (
                <div className='border-l-4 border-orange-200 pl-4 flex flex-col gap-2'>
                  <label className='text-sm font-medium text-muted-foreground'>Проверка данных</label>
                  <p className='text-sm'>{formatDate(driverProfile.backgroundCheckDate)}</p>
                </div>
              )}
            </div>
          )}

          <div className='border-l-4 border-pink-200 pl-4 flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted-foreground'>
              Предпочитаемые классы обслуживания
            </label>
            <div className='flex flex-wrap gap-1'>
              {driverProfile.preferredRideTypes?.map(type => (
                <Badge key={type} variant='secondary' className='text-xs w-fit'>
                  {getServiceClassLabel(type)}
                </Badge>
              ))}
            </div>
          </div>

          <div className='border-l-4 border-indigo-200 pl-4 flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted-foreground'>Обучение пройдено</label>
            <Badge
              variant={driverProfile.trainingCompleted ? 'default' : 'destructive'}
              className='w-fit'
            >
              {driverProfile.trainingCompleted ? 'Да' : 'Нет'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
