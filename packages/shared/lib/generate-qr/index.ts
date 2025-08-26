// Утилита для валидации и форматирования суммы
export const formatSum = (sum: number): number => {
    // Округляем до 2 знаков после запятой
    return Math.round(sum * 100) / 100;
};

// Утилита для валидации и очистки примечания
export const validateAndCleanNote = (note: string): string => {
    // Удаляем запрещённые символы: \«»&<>
    const cleanedNote = note.replace(/[\\«»&<>]/g, '');

    // Обрезаем до максимальной длины 140 символов
    return cleanedNote.slice(0, 140);
};