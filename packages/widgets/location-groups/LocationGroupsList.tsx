'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locationGroupsApi, type LocationGroupDTO } from '@shared/api/location-groups';
import { toast } from '@shared/lib/conditional-toast';
import LocationContainer from '@widgets/location/ui/LocationContainer';

interface LocationGroupsListProps {
  city: string;
  className?: string;
}

export const LocationGroupsList: React.FC<LocationGroupsListProps> = ({ city, className }) => {
  const router = useRouter();
  const [groups, setGroups] = useState<LocationGroupDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGroups();
  }, [city]);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      
      // Временное решение: получаем все группы, а затем фильтруем по локациям
      const allGroupsResponse = await locationGroupsApi.getLocationGroups();
      const allGroups = allGroupsResponse.data;
      
      // Получаем все локации для фильтрации
      const { locationsApi } = await import('@shared/api/locations');
      const locationsResponse = await locationsApi.getLocations({ 
        city: city,
        size: 1000 // Получаем много локаций для фильтрации
      });
      
      // Находим уникальные группы, которые имеют локации в выбранном городе
      const cityLocationGroups = new Set<string>();
      locationsResponse.data.forEach(location => {
        if (location.group) {
          cityLocationGroups.add(location.group);
        }
      });
      
      // Фильтруем группы по найденным ID
      const filteredGroups = allGroups.filter(group => 
        cityLocationGroups.has(group.id)
      );
      
      setGroups(filteredGroups);
    } catch (error) {
      console.error('Ошибка загрузки групп:', error);
      toast.error('Ошибка загрузки групп локаций');
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupClick = (groupId: string) => {
    // Переходим на страницу локаций группы
    router.push(`/locations?group=${groupId}`);
  };

  return (
    <LocationContainer 
      className={className}
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
  );
};
