import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { 
  getTerminalComponent, 
  getTerminalMetadata, 
  isValidTerminalRoute,
} from '@compass-terminal/config';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ route?: string[] }>;
}): Promise<Metadata> => {
  const { route } = await params;
  const segments = route || [];

  // Если нет сегментов, показываем главную страницу
  if (segments.length === 0) {
    const metadata = getTerminalMetadata('main');

    return metadata || {
      title: 'Терминал | Compass 2.0',
      description: 'Главная страница терминала',
    };
  }

  // Получаем метаданные для конкретного маршрута
  const routeName = segments[0];

  if (isValidTerminalRoute(routeName)) {
    const metadata = getTerminalMetadata(routeName);

    return metadata || {
      title: 'Терминал | Compass 2.0',
      description: 'Страница терминала',
    };
  }

  // Fallback для неизвестных маршрутов
  return {
    title: 'Страница не найдена | Compass 2.0',
    description: 'Запрашиваемая страница не существует',
  };
};

export default async function TerminalRouter({
  params,
}: {
  params: Promise<{ route?: string[] }>;
}) {
  const { route } = await params;
  const segments = route || [];

  // Если нет сегментов, показываем главную страницу
  if (segments.length === 0) {
    const MainComponent = getTerminalComponent('main');
    
    if (!MainComponent) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Компонент не найден</h1>
            <p>Главный компонент терминала не существует.</p>
          </div>
        </div>
      );
    }

    // Получаем язык из cookie для главной страницы
    const cookieName = process.env.NEXT_PUBLIC_LAN_COOKIE_NAME || 'LANG';
    const cookieStore = await cookies();
    const languageCookie = cookieStore.get(cookieName);

    const supportedLanguages = ['ru', 'en', 'kg'];
    const currentLanguage =
      languageCookie?.value && supportedLanguages.includes(languageCookie.value)
        ? languageCookie.value
        : 'kg';

    return <MainComponent initialLanguage={currentLanguage} />;
  }

  // Обрабатываем конкретный маршрут
  const routeName = segments[0];
  
  if (!isValidTerminalRoute(routeName)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Страница не найдена</h1>
          <p>Маршрут &quot;{routeName}&quot; не существует.</p>
        </div>
      </div>
    );
  }

  const RouteComponent = getTerminalComponent(routeName);

  if (!RouteComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Компонент не найден</h1>
          <p>Компонент для маршрута &quot;{routeName}&quot; не существует.</p>
        </div>
      </div>
    );
  }

  return <RouteComponent />;
} 