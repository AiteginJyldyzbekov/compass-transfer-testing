import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Создает трансформацию для валидации дат в Zod схемах
 * Преобразует строку даты в ISO формат и валидирует её
 */
export function createDateTimeTransform() {
  return z.string().transform((val, ctx) => {
    if (!val) return val;

    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Неверный формат даты",
        });
        return z.NEVER;
      }
      return date.toISOString();
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Неверный формат даты",
      });
      return z.NEVER;
    }
  });
}