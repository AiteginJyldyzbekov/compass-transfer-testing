'use client';

import { UserRidesTableFilters, UserRidesTableContent, UserRidesTablePagination } from './components';
import { useUserRidesTable } from './hooks/use-user-rides-table';

interface UserRidesTableProps {
  userId: string;
}

export function UserRidesTable({ userId }: UserRidesTableProps) {
  const {
    paginatedRides,
    loading,
    error,
    searchTerm,
    statusFilter,
    showAdvancedFilters,
    pageSize,
    columnVisibility,
    totalCount,
    hasNext,
    hasPrevious,
    currentPageNumber,
    sortBy,
    sortOrder,
    setSearchTerm,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleStatusFilterChange,
    handleSortChange,
    refetch,
  } = useUserRidesTable(userId);

  const handleViewDetails = (rideId: string) => {
    // Найдем поездку по ID, чтобы получить orderId
    const ride = paginatedRides.find(r => r.id === rideId);
    if (ride && ride.orderId) {
      // Импортируем функцию и enum
      const { getOrderViewRoute } = require('@entities/orders/utils/order-routes');
      const { OrderType } = require('@entities/orders/enums/OrderType.enum');

      // Пока используем Instant по умолчанию
      // TODO: Когда API будет возвращать тип заказа, использовать его
      const orderType = OrderType.Instant;
      const route = getOrderViewRoute(ride.orderId, orderType);

      window.open(route, '_blank');
    } else {
      // Fallback - переходим к поездке (пока не реализовано)
      window.open(`/rides/${rideId}`, '_blank');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-red-500 text-lg font-semibold">Ошибка загрузки поездок</div>
        <div className="text-muted-foreground">{error}</div>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Фильтры и поиск */}
      <UserRidesTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        columnVisibility={columnVisibility}
        handleColumnVisibilityChange={handleColumnVisibilityChange}
        totalCount={totalCount}
        onRefresh={refetch}
      />

      {/* Таблица */}
      <UserRidesTableContent
        rides={paginatedRides}
        loading={loading}
        columnVisibility={columnVisibility}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onViewDetails={handleViewDetails}
      />

      {/* Пагинация */}
      <UserRidesTablePagination
        paginatedRides={paginatedRides}
        totalCount={totalCount}
        pageSize={pageSize}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        currentPageNumber={currentPageNumber}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFirstPage={handleFirstPage}
      />
    </div>
  );
}
