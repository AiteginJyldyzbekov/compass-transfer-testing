/**
 * `NationalPassport` = Внутренний паспорт<br>`InternationalPassport` = Заграничный паспорт<br>`IdCard` = Идентификационная карта<br>`ResidencePermit` = Вид на жительство<br>`RefugeeId` = Удостоверение беженца<br>`TemporaryId` = Временное удостоверение личности<br>`MilitaryId` = Военный билет<br>`ForeignPassport` = Иностранный паспорт<br>`DriversLicense` = Водительское удостоверение
 * @enum
 */
export enum IdentityDocumentType {
  NationalPassport = 'NationalPassport',
  InternationalPassport = 'InternationalPassport',
  IdCard = 'IdCard',
  ResidencePermit = 'ResidencePermit',
  RefugeeId = 'RefugeeId',
  TemporaryId = 'TemporaryId',
  MilitaryId = 'MilitaryId',
  ForeignPassport = 'ForeignPassport',
  DriversLicense = 'DriversLicense',
}
/**
 * Массив всех значений IdentityDocumentType
 */
export const IdentityDocumentTypeValues = [
  IdentityDocumentType.NationalPassport,
  IdentityDocumentType.InternationalPassport,
  IdentityDocumentType.IdCard,
  IdentityDocumentType.ResidencePermit,
  IdentityDocumentType.RefugeeId,
  IdentityDocumentType.TemporaryId,
  IdentityDocumentType.MilitaryId,
  IdentityDocumentType.ForeignPassport,
  IdentityDocumentType.DriversLicense,
];