import type { Metadata } from 'next';
import Link from 'next/link';

// Метаданные для страницы
export const metadata: Metadata = {
  title: 'Страница не найдена | Мой Сайт',
  description: 'Страница не найдена',
};
// // Явно указываем, что страница статическая
export const dynamic = 'force-static';
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[color:var(--color-brand)] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[color:var(--color-brand)] mb-2">
          Страница не найдена
        </h2>
        <p className="text-lg text-[color:var(--color-brand)] mb-6">
          Извините, но запрашиваемая вами страница не существует.
        </p>
        <Link
          href="/"
          className="text-lg font-medium text-[color:var(--color-brand)] hover:underline"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
