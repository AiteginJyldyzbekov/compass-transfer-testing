// Утилита для валидации и форматирования суммы
export const formatSum = (sum: number): number => {
    // Округляем до целого числа
    return Math.round(sum);
};
// Утилита для валидации и очистки примечания
export const validateAndCleanNote = (note: string): string => {
    // Удаляем запрещённые символы: \«»&<>
    const cleanedNote = note.replace(/[\\«»&<>]/g, '');

    // Обрезаем до максимальной длины 140 символов
    return cleanedNote.slice(0, 140);
};