/**
 * Интерфейс AdminProfile
 * @interface
 */
export interface AdminProfile {
  accessLevel: string;
  department?: string | null;
  position?: string | null;
}