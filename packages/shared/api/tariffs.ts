import type { CarType } from '@entities/tariffs/enums/CarType.enum';
import type { ServiceClass } from '@entities/tariffs/enums/ServiceClass.enum';
import type { CreateTariffDTO } from '@entities/tariffs/interface/CreateTariffDTO';
import type { GetTariffDTO } from '@entities/tariffs/interface/GetTariffDTO';
import type { UpdateTariffDTO } from '@entities/tariffs/interface/UpdateTariffDTO';
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
interface TariffFilters {
  // Пагинация (cursor-based)
  first?: boolean;
  before?: string;
  after?: string;
  last?: boolean;
  size?: number;

  // Поиск по полям
  name?: string;
  nameOp?: SearchOperator;
  serviceClass?: ServiceClass[];
  carType?: CarType[];
  basePrice?: number;
  basePriceOp?: ComparisonOperator;
  minutePrice?: number;
  minutePriceOp?: ComparisonOperator;
  minimumPrice?: number;
  minimumPriceOp?: ComparisonOperator;
  perKmPrice?: number;
  perKmPriceOp?: ComparisonOperator;
  freeWaitingTimeMinutes?: number;
  freeWaitingTimeMinutesOp?: ComparisonOperator;
  archived?: boolean;

  // Полнотекстовый поиск
  'FTS.Plain'?: string;
  'FTS.Query'?: string;

  // Сортировка
  sortBy?: string;
  sortOrder?: SortOrder;
}

interface TariffApiResponse {
  data: GetTariffDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const tariffsApi = {
  // Получение списка тарифов
  getTariffs: async (params?: TariffFilters): Promise<TariffApiResponse> => {
    const result = await apiGet<TariffApiResponse>('/Tariff', { params });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Получение тарифа по ID
  getTariffById: async (id: string): Promise<GetTariffDTO> => {
    const result = await apiGet<GetTariffDTO>(`/Tariff/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Создание тарифа
  createTariff: async (data: CreateTariffDTO): Promise<GetTariffDTO> => {
    const result = await apiPost<GetTariffDTO, CreateTariffDTO>('/Tariff', data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Обновление тарифа
  updateTariff: async (id: string, data: UpdateTariffDTO): Promise<GetTariffDTO> => {
    const result = await apiPut<GetTariffDTO, UpdateTariffDTO>(`/Tariff/${id}`, data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Удаление тарифа
  deleteTariff: async (id: string): Promise<void> => {
    const result = await apiDelete(`/Tariff/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }
  },

  // Установка статуса архивирования тарифа
  setArchivedStatus: async (id: string, archived: boolean): Promise<GetTariffDTO> => {
    const result = await apiPost<GetTariffDTO, boolean>(`/Tariff/${id}/archived`, archived);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },
};

export type { 
  TariffFilters, 
  TariffApiResponse, 
  GetTariffDTO 
};
