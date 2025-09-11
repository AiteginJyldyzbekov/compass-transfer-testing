'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locationGroupsApi, type LocationGroupDTO } from '@shared/api/location-groups';
import { toast } from '@shared/lib/conditional-toast';
import LocationContainer from '@widgets/location/ui/LocationContainer';

interface LocationGroupsProps {
  city: string;
  onBack: () => void;
}

export const LocationGroups: React.FC<LocationGroupsProps> = ({ city, onBack }) => {
  const t = useTranslations();
  const router = useRouter();
  const [groups, setGroups] = useState<LocationGroupDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGroups();
  }, [city]);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const response = await locationGroupsApi.getLocationGroupsByCity(city);
      setGroups(response.data);
    } catch (error) {
      console.error('Ошибка загрузки групп:', error);
      toast.error('Ошибка загрузки групп локаций');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupClick = (groupId: string) => {
    // Переходим на страницу локаций группы
    router.push(`/locations?group=${groupId}`);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-10">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h3 className="text-[28px] text-[#090A0B] font-bold leading-[130%]">
          Группы локаций в {city}
        </h3>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#666666] hover:text-[#333333] transition-colors"
        >
          <span className="text-[24px]">←</span>
          <span className="text-[24px]">Назад</span>
        </button>
      </div>

      {/* Список групп */}
      <LocationContainer
        className="max-h-[400px] overflow-y-auto scrollbar-hide"
        showEmptyMessage
        emptyMessage="Группы не найдены"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-[24px] text-[#666666]">Загрузка групп...</p>
          </div>
        ) : groups.length > 0 ? (
          groups.map((group, i) => (
            <React.Fragment key={group.id}>
              {i > 0 && <div className="border-b border-gray-200" />}
              <div
                onClick={() => handleGroupClick(group.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="text-[32px] text-[#1E1E1E] leading-[150%] font-semibold">
                    {group.name}
                  </h4>
                  <p className="text-[24px] text-[#A3A5AE] leading-[150%]">
                    Группа локаций
                  </p>
                </div>
                <div className="text-[24px] text-[#A3A5AE]">→</div>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[24px] text-[#666666]">
              В городе {city} нет групп локаций
            </p>
          </div>
        )}
      </LocationContainer>
    </div>
  );
};
