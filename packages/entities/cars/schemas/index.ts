// Экспорт схем валидации для автомобилей
export * from '@entities/cars/schemas/carCreateSchema';
export * from '@entities/cars/schemas/carUpdateSchema';
// Экспорт схем для связей водитель-автомобиль
export * from '@entities/cars/schemas/carDriverRelationCreateSchema';
export * from '@entities/cars/schemas/carDriverRelationUpdateSchema';
// Экспорт схем для операций водителя с автомобилями
export * from '@entities/cars/schemas/driverCarActivitySchema';
