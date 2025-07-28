import type { IdentityDocumentType } from '@entities/users/enums';

/**
 * Интерфейс Passport
 * @interface
 */
export interface Passport {
  number: string;
  series?: string | null;
  issueDate?: string | null;
  issuedBy?: string | null;
  page?: number | null;
  expiryDate?: string | null;
  identityType?: IdentityDocumentType;
}
