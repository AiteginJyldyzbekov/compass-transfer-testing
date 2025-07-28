// Обновляем тип параметров
export interface ImportParams {
  userId: string;
  businessId: string;
}
// Интерфейс для страничных параметров с Promise
export interface PageProps {
  params: Promise<ImportParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}