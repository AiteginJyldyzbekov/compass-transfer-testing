/**
 * Интерфейс HttpValidationProblemDetails
 * @interface
 */
export interface HttpValidationProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  errors?: Record<string, any>;
}