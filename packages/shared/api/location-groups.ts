import { apiGet, apiPost, apiPut, apiDelete } from './client';

// Интерфейс для группы локаций
export interface LocationGroupDTO {
  id: string;
  name: string;
  city: string;
}

// Интерфейс для ответа со списком групп
export interface LocationGroupListResponseDTO {
  data: LocationGroupDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Интерфейс для создания группы
export interface CreateLocationGroupDTO {
  name: string;
  city: string;
}

// Интерфейс для обновления группы
export interface UpdateLocationGroupDTO {
  name: string;
  city: string;
}

export const locationGroupsApi = {
  // Получение всех групп локаций
  getLocationGroups: async (): Promise<LocationGroupListResponseDTO> => {
    const result = await apiGet<LocationGroupListResponseDTO>('/LocationGroup');

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Получение групп локаций по городу
  getLocationGroupsByCity: async (city: string): Promise<LocationGroupListResponseDTO> => {
    const result = await apiGet<LocationGroupListResponseDTO>('/LocationGroup', {
      params: { city }
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Создание группы локаций
  createLocationGroup: async (data: CreateLocationGroupDTO): Promise<LocationGroupDTO> => {
    const result = await apiPost<LocationGroupDTO, CreateLocationGroupDTO>('/LocationGroup', data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Обновление группы локаций
  updateLocationGroup: async (id: string, data: UpdateLocationGroupDTO): Promise<LocationGroupDTO> => {
    const result = await apiPut<LocationGroupDTO, UpdateLocationGroupDTO>(`/LocationGroup/${id}`, data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Удаление группы локаций
  deleteLocationGroup: async (id: string): Promise<void> => {
    const result = await apiDelete(`/LocationGroup/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }
  },
};
