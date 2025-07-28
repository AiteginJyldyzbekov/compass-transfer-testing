import { getStringParam } from '@shared/lib/params/next-params';
import { ActiveRidePage } from '@pages/driver/active-ride/ActiveRidePage';
/**
 * Пропсы страницы активной поездки
 */
interface ActiveRidePageProps {
  searchParams: {
    orderId?: string | string[];
    rideId?: string | string[];
  };
}

/**
 * Страница активной поездки с query параметрами
 */
export default function ActiveRide({ searchParams }: ActiveRidePageProps) {
  const orderId = getStringParam(searchParams.orderId);
  const rideId = getStringParam(searchParams.rideId);

  // Должен быть хотя бы один из параметров
  if (!orderId && !rideId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Не указаны параметры поездки</p>
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Вернуться к заявкам
          </a>
        </div>
      </div>
    );
  }
  // Используем orderId как основной, rideId как дополнительный
  const effectiveOrderId = orderId || rideId!;
  const effectiveRideId = rideId || orderId!;

  return (
    <ActiveRidePage 
      orderId={effectiveOrderId} 
      rideId={effectiveRideId}
    />
  );
}
