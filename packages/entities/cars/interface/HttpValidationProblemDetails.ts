/**
 * Интерфейс для деталей ошибки валидации HTTP запроса
 * @interface HttpValidationProblemDetails
 */
export interface HttpValidationProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  errors?: Record<string, string[]>;
}
