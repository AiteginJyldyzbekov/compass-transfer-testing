import type { GetServiceDTO } from '@entities/services/interface/GetServiceDTO';
import type { GetServiceDTOKeysetPaginationResult } from '@entities/services/interface/GetServiceDTOKeysetPaginationResult';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

// Операторы поиска
type SearchOperator =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'NotContains'
  | 'StartsWith'
  | 'EndsWith'
  | 'IsEmpty'
  | 'IsNotEmpty';

// Операторы сравнения для числовых полей
type ComparisonOperator =
  | 'GreaterThan'
  | 'GreaterThanOrEqual'
  | 'Equal'
  | 'LessThanOrEqual'
  | 'LessThan';

// Поля для сортировки
type SortOrder = 'Asc' | 'Desc';

// Типы для API фильтров
interface ServiceFilters {
  // Пагинация (cursor-based)
  first?: boolean;
  before?: string;
  after?: string;
  last?: boolean;
  size?: number;

  // Поиск по полям
  name?: string;
  nameOp?: SearchOperator;
  price?: number;
  priceOp?: ComparisonOperator;
  isQuantifiable?: boolean;

  // Полнотекстовый поиск
  'FTS.Plain'?: string;
  'FTS.Query'?: string;

  // Сортировка
  sortBy?: string;
  sortOrder?: SortOrder;
}

interface ServiceApiResponse {
  data: GetServiceDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// DTO для создания услуги
interface CreateServiceDTO {
  name: string;
  description?: string | null;
  price: number;
  isQuantifiable: boolean;
}

// DTO для обновления услуги
interface UpdateServiceDTO {
  name?: string;
  description?: string | null;
  price?: number;
  isQuantifiable?: boolean;
}

export const servicesApi = {
  // Получение списка услуг
  getServices: async (params?: ServiceFilters): Promise<ServiceApiResponse> => {
    const result = await apiGet<ServiceApiResponse>('/Service', { params });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Получение услуги по ID
  getServiceById: async (id: string): Promise<GetServiceDTO> => {
    const result = await apiGet<GetServiceDTO>(`/Service/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Создание услуги
  createService: async (data: CreateServiceDTO): Promise<GetServiceDTO> => {
    const result = await apiPost<GetServiceDTO, CreateServiceDTO>('/Service', data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Обновление услуги
  updateService: async (id: string, data: UpdateServiceDTO): Promise<GetServiceDTO> => {
    const result = await apiPut<GetServiceDTO, UpdateServiceDTO>(`/Service/${id}`, data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Удаление услуги
  deleteService: async (id: string): Promise<void> => {
    const result = await apiDelete(`/Service/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }
  },
};

export type { ServiceFilters, ServiceApiResponse, CreateServiceDTO, UpdateServiceDTO };
