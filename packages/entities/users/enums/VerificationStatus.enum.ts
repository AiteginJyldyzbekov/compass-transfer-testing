/**
 * `Pending` = Ожидает проверки<br>`Verified` = Проверен и подтвержден<br>`Rejected` = Отклонен<br>`InReview` = На рассмотрении<br>`Expired` = Истек срок действия
 * @enum
 */
export enum VerificationStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected',
  InReview = 'InReview',
  Expired = 'Expired',
}
/**
 * Массив всех значений VerificationStatus
 */
export const VerificationStatusValues = [
  VerificationStatus.Pending,
  VerificationStatus.Verified,
  VerificationStatus.Rejected,
  VerificationStatus.InReview,
  VerificationStatus.Expired,
];