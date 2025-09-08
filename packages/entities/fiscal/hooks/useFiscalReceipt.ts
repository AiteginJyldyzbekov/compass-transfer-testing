'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
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
    orderNumber: string;
    driver?: { 
      fullName: string;
      phoneNumber?: string;
    };
    car?: { 
      make: string;
      model: string; 
      licensePlate: string;
      color: string;
    };
    queueNumber?: string;
  }) => Promise<boolean>;
  printReceiptWithLogo: (logoBase64: string, data: {
    price: number;
    route: string;
    paymentMethod: string;
    orderNumber: string;
    driver?: { 
      fullName: string;
      phoneNumber?: string;
    };
    car?: { 
      make: string;
      model: string; 
      licensePlate: string;
      color: string;
    };
    queueNumber?: string;
  }) => Promise<boolean>;
  printFullReceiptPNG: (receiptPNGBase64: string) => Promise<boolean>;
}

/**
 * Хук для работы с фискальными чеками
 * Предоставляет удобный интерфейс для создания чеков в React компонентах
 */
export const useFiscalReceipt = (): UseFiscalReceiptResult => {
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  /* ===== ЛОГИКА СОЗДАНИЯ ФИСКАЛЬНЫХ ЧЕКОВ ===== */

  /**
   * Создать чек для поездки на такси
   */
  const createTaxiReceipt = useCallback(
    async (data: TaxiReceiptData): Promise<boolean> => {


      if (!FISCAL_ENABLED) {
        toast.warning(
          '⚠️ Фискализация отключена! Установите NEXT_PUBLIC_USE_FISCAL=true для включения',
        );

        return true;
      }
      if (isCreating) {
        toast.warning('⚠️ Чек уже создается, игнорируем повторный запрос');

        return false;
      }

      setIsCreating(true);

      try {
        await fiscalService.createTaxiReceipt(data);

        return true;
      } catch (error) {
        console.error('❌ Ошибка создания фискального чека:', error);

        if (error instanceof FiscalError) {
          // Обрабатываем специфичные фискальные ошибки
          if (error.isCritical) {
          } else if (error.isPrintError) {

            // Для ошибок печати возвращаем true, так как документ создан
            return true;
          } else {
          }
        } else {
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

      const { isReady, issues } = await fiscalService.checkReadiness();

      if (isReady) {

        return true;
      } else {

        // Показываем первую проблему пользователю
        if (issues.length > 0) {

        }

        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка проверки ФН:', error);

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

      await fiscalService.voidReceipt();

      return true;
    } catch (error) {

      if (error instanceof FiscalError) {
      } else {
      }

      return false;
    }
  }, []);

  /**
   * Печать растрового изображения чека
   * @param rasterBase64 - изображение в формате Base64
   */
  const printReceiptImage = useCallback(async (rasterBase64: string): Promise<boolean> => {

    // Проверяем, включена ли фискализация
    if (!FISCAL_ENABLED) {

      return true;
    }

    try {
      await fiscalService.printRaster(rasterBase64);

      return true;
    } catch (error) {
      
      if (error instanceof FiscalError) {
      } else {

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
    orderNumber: string;
    driver?: { 
      fullName: string;
      phoneNumber?: string;
    };
    car?: { 
      make: string;
      model: string; 
      licensePlate: string;
      color: string;
    };
    queueNumber?: string;
  }): Promise<boolean> => {
    console.log('🖨️ Печатаем текстовый чек построчно...');

    // Проверяем, включена ли фискализация
    if (!FISCAL_ENABLED) {

      return true;
    }

    try {
      await fiscalService.printTaxiReceiptLines(data);

      return true;
    } catch (error) {
      
      if (error instanceof FiscalError) {
      } else {
      }

      return false;
    }
  }, []);

  /**
   * Печать чека с логотипом: сначала логотип, затем текст, затем обрезание
   */
  const printReceiptWithLogo = useCallback(async (logoBase64: string, data: {
    price: number;
    route: string;
    paymentMethod: string;
    orderNumber: string;
    driver?: { 
      fullName: string;
      phoneNumber?: string;
    };
    car?: { 
      make: string;
      model: string; 
      licensePlate: string;
      color: string;
    };
    queueNumber?: string;
  }): Promise<boolean> => {
    console.log('🖨️ Печатаем чек с логотипом...');

    // Проверяем, включена ли фискализация
    if (!FISCAL_ENABLED) {
      console.log('⚠️ Фискализация отключена, пропускаем печать');
      return true;
    }

    try {
      await fiscalService.printTaxiReceiptWithLogo(logoBase64, data);
      console.log('✅ Чек с логотипом успешно напечатан');
      return true;
    } catch (error) {
      console.error('❌ Ошибка печати чека с логотипом:', error);
      
      if (error instanceof FiscalError) {
        toast.error(`Ошибка печати чека: ${error.message}`);
      }
      //  else {
      //   toast.error('Неизвестная ошибка при печати чека');
      // }

      return false;
    }
  }, []);

  /**
   * Печать полного чека как PNG изображения
   */
  const printFullReceiptPNG = useCallback(async (receiptPNGBase64: string): Promise<boolean> => {
    console.log('🖨️ Печатаем полный чек как PNG...');

    // Проверяем, включена ли фискализация
    if (!FISCAL_ENABLED) {
      console.log('⚠️ Фискализация отключена, пропускаем печать');
      return true;
    }

    try {
      await fiscalService.printFullReceiptPNG(receiptPNGBase64);
      console.log('✅ Полный чек PNG успешно напечатан');
      return true;
    } catch (error) {
      // console.error('❌ Ошибка печати полного чека PNG:', error);
      
      // if (error instanceof FiscalError) {
      //   toast.error(`Ошибка печати чека: ${error.message}`);
      // }
      //  else {
      //   toast.error('Неизвестная ошибка при печати чека');
      // }

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
    printReceiptWithLogo,
    printFullReceiptPNG,
  };
};
