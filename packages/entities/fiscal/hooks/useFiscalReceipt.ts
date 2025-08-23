'use client';

import { useCallback, useState } from 'react';
import { showToast } from '@shared/toast';
import { fiscalService } from '../api/fiscal-service';
import { FiscalError } from '../interface/fiscal-error';
import type { TaxiReceiptData } from '../interface/fiscal-types';

// Глобальный флаг: включена ли фискализация (должен быть true только на киоске)
const FISCAL_ENABLED = process.env.NEXT_PUBLIC_USE_FISCAL === 'true';

interface UseFiscalReceiptResult {
  isCreating: boolean;
  isChecking: boolean;
  createTaxiReceipt: (data: TaxiReceiptData) => Promise<boolean>;
  checkFiscalReadiness: () => Promise<boolean>;
  voidLastReceipt: () => Promise<boolean>;
  printReceiptImage: (rasterBase64: string) => Promise<boolean>;
  printReceiptLines: (data: {
    price: number;
    route: string;
    paymentMethod: string;
    orderId: string;
    driver?: { fullName: string };
    car?: { model: string; licensePlate: string };
  }) => Promise<boolean>;
}

/**
 * Хук для работы с фискальными чеками
 * Предоставляет удобный интерфейс для создания чеков в React компонентах
 */
export const useFiscalReceipt = (): UseFiscalReceiptResult => {
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  /* ===== ОСТАЛЬНАЯ РЕАЛЬНАЯ ЛОГИКА ЕСЛИ ФИСКАЛИЗАЦИЯ ВКЛЮЧЕНА ===== */

  /**
   * Создать чек для поездки на такси
   */
  const createTaxiReceipt = useCallback(
    async (data: TaxiReceiptData): Promise<boolean> => {
      console.log('🔍 Проверка фискализации:', {
        FISCAL_ENABLED,
        env: process.env.NEXT_PUBLIC_USE_FISCAL,
      });

      if (!FISCAL_ENABLED) {
        console.warn(
          '⚠️ Фискализация отключена! Установите NEXT_PUBLIC_USE_FISCAL=true для включения',
        );

        return true;
      }
      if (isCreating) {
        console.warn('⚠️ Чек уже создается, игнорируем повторный запрос');

        return false;
      }

      setIsCreating(true);

      try {
        console.log('🧾 Начинаем создание фискального чека:', data);

        await fiscalService.createTaxiReceipt(data);

        showToast.success('✅ Фискальный чек создан успешно');
        console.log('✅ Фискальный чек создан успешно');

        return true;
      } catch (error) {
        console.error('❌ Ошибка создания фискального чека:', error);

        if (error instanceof FiscalError) {
          // Обрабатываем специфичные фискальные ошибки
          if (error.isCritical) {
            showToast.error(`❌ Критическая ошибка ФН: ${error.message}`);
          } else if (error.isPrintError) {
            showToast.warn(`⚠️ Чек создан, но ошибка печати: ${error.message}`);

            // Для ошибок печати возвращаем true, так как документ создан
            return true;
          } else {
            showToast.error(`❌ Ошибка фискализации: ${error.message}`);
          }
        } else {
          showToast.error('❌ Неизвестная ошибка при создании чека');
        }

        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [isCreating],
  );

  /**
   * Проверить готовность фискального накопителя
   */
  const checkFiscalReadiness = useCallback(async (): Promise<boolean> => {
    if (!FISCAL_ENABLED) {
      return true;
    }
    if (isChecking) {
      return false;
    }

    setIsChecking(true);

    try {
      console.log('🔍 Проверяем готовность фискального накопителя...');

      const { isReady, issues } = await fiscalService.checkReadiness();

      if (isReady) {
        console.log('✅ Фискальный накопитель готов к работе');

        return true;
      } else {
        console.warn('⚠️ Проблемы с фискальным накопителем:', issues);

        // Показываем первую проблему пользователю
        if (issues.length > 0) {
          showToast.warn(`⚠️ ФН: ${issues[0]}`);
        }

        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка проверки ФН:', error);
      showToast.error('❌ Не удается проверить состояние ФН');

      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  /**
   * Аннулировать последний чек
   */
  const voidLastReceipt = useCallback(async (): Promise<boolean> => {
    if (!FISCAL_ENABLED) return true;
    try {
      console.log('❌ Аннулируем последний чек...');

      await fiscalService.voidReceipt();

      showToast.success('✅ Чек аннулирован');
      console.log('✅ Чек аннулирован успешно');

      return true;
    } catch (error) {
      console.error('❌ Ошибка аннулирования чека:', error);

      if (error instanceof FiscalError) {
        showToast.error(`❌ Ошибка аннулирования: ${error.message}`);
      } else {
        showToast.error('❌ Не удалось аннулировать чек');
      }

      return false;
    }
  }, []);

  /**
   * Печать растрового изображения чека
   * @param rasterBase64 - изображение в формате Base64
   */
  const printReceiptImage = useCallback(async (rasterBase64: string): Promise<boolean> => {
    console.log('🖨️ Печатаем растровое изображение чека...');

    // Проверяем, включена ли фискализация
    if (!FISCAL_ENABLED) {
      console.log('🔄 Фискализация отключена - пропускаем печать изображения');
      return true;
    }

    try {
      await fiscalService.printRaster(rasterBase64);
      console.log('✅ Растровое изображение чека напечатано успешно');
      return true;
    } catch (error) {
      console.error('❌ Ошибка печати растрового изображения чека:', error);
      
      if (error instanceof FiscalError) {
        showToast.error(`❌ Ошибка печати изображения: ${error.message}`);
      } else {
        showToast.error('❌ Не удалось напечатать изображение чека');
      }

      return false;
    }
  }, []);

  /**
   * Печать чека построчно одним запросом
   */
  const printReceiptLines = useCallback(async (data: {
    price: number;
    route: string;
    paymentMethod: string;
    orderId: string;
    driver?: { fullName: string };
    car?: { model: string; licensePlate: string };
  }): Promise<boolean> => {
    console.log('🖨️ Печатаем текстовый чек построчно...');

    // Проверяем, включена ли фискализация
    if (!FISCAL_ENABLED) {
      console.log('🔄 Фискализация отключена - пропускаем печать чека');
      return true;
    }

    try {
      await fiscalService.printTaxiReceiptLines(data);
      console.log('✅ Текстовый чек напечатан успешно');
      return true;
    } catch (error) {
      console.error('❌ Ошибка печати текстового чека:', error);
      
      if (error instanceof FiscalError) {
        showToast.error(`❌ Ошибка печати чека: ${error.message}`);
      } else {
        showToast.error('❌ Не удалось напечатать чек');
      }

      return false;
    }
  }, []);

  return {
    isCreating,
    isChecking,
    createTaxiReceipt,
    checkFiscalReadiness,
    voidLastReceipt,
    printReceiptImage,
    printReceiptLines,
  };
};
