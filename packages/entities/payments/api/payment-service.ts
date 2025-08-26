import { BaseApiService } from '@shared/api';
import { formatSum, validateAndCleanNote } from '@shared/lib/generate-qr';

export interface GenerateQRRequest {
  sum: number;
  note: string;
}

export interface GenerateQRResponse {
  qrBase64: string;
  qrUrl: string | null;
  transactionId: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'EXPIRED';
  sum: number;
  transactionId?: string;
  processedAt?: string;
}

/**
 * Сервис для работы с платежами Optima
 * Отделен от логики заказов согласно принципу единственной ответственности
 *
 * ИСПРАВЛЕНО: Структура запроса согласно реальному API
 */
export class PaymentService extends BaseApiService {
  protected baseUrl = '/Payment';

  /**
   * Генерация QR-кода для оплаты Optima
   * API ожидает только sum и note
   */
  async generateOptimaQR(sum: number, note: string): Promise<GenerateQRResponse> {
    // Дополнительная валидация на уровне сервиса
    const formattedSum = formatSum(sum);
    const cleanedNote = validateAndCleanNote(note);

    // Проверяем валидность данных
    if (formattedSum <= 0) {
      throw new Error('Некорректная сумма транзакции');
    }

    if (!cleanedNote.trim()) {
      throw new Error('Примечание не может быть пустым после очистки');
    }

    const requestBody: GenerateQRRequest = {
      sum: formattedSum,
      note: cleanedNote,
    };

    console.log('Отправляем на сервер:', requestBody); // для отладки

    const result = await this.post<GenerateQRResponse, GenerateQRRequest>(
      '/Optima/generate-qr',
      requestBody,
    );

    return this.handleApiResult(result);
  }

  /**
   * Проверка статуса платежа
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const result = await this.get<PaymentStatus>(`/status/${paymentId}`);

    return this.handleApiResult(result);
  }

  /**
   * Отмена платежа
   * @deprecated API не поддерживает отмену платежей (возвращает 404)
   * Используйте локальную отмену состояния в хуке useOptimaPayment
   */
  // async cancelPayment(paymentId: string): Promise<void> {
  //   const result = await this.delete<void>(`/${paymentId}`);
  //   this.handleApiResult(result);
  // }

  /**
   * Инициация оплаты банковской картой через POS (NewCas ExecutePayment)
   */
  async executePosSale(amount: number, note: string) {
    const body = { amount, note, type: 'sale' };

    const fiscalUrl = process.env.NEXT_PUBLIC_FISCAL_URL || 'http://localhost:4445';
    const endpoint = fiscalUrl + '/ExecutePayment';

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      throw new Error(`POS execute payment failed ${resp.status}`);
    }

    const data = await resp.json();

    return data as { paymentId: string };
  }
}

export const paymentService = new PaymentService();
