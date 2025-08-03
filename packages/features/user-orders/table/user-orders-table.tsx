'use client';

import { UserOrdersTableFilters, UserOrdersTableContent, UserOrdersTablePagination } from './components';
import { useUserOrdersTable } from './hooks/use-user-orders-table';

interface UserOrdersTableProps {
  userId: string;
}

export function UserOrdersTable({ userId }: UserOrdersTableProps) {
  const {
    paginatedOrders,
    loading,
    error,
    searchTerm,
    typeFilter,
    statusFilter,
    subStatusFilter,
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
    handleTypeFilterChange,
    handleStatusFilterChange,
    handleSubStatusFilterChange,
    handleSortChange,
    refetch,
  } = useUserOrdersTable(userId);

  const handleViewDetails = (orderId: string, orderType: string) => {
    // Импортируем функцию и enum
    const { getOrderViewRoute } = require('@entities/orders/utils/order-routes');
    const { OrderType } = require('@entities/orders/enums/OrderType.enum');

    // Преобразуем строку в enum
    const orderTypeEnum = orderType as keyof typeof OrderType;
    const route = getOrderViewRoute(orderId, OrderType[orderTypeEnum] || OrderType.Instant);

    window.open(route, '_blank');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-red-500 text-lg font-semibold">Ошибка загрузки заказов</div>
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
      <UserOrdersTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        handleTypeFilterChange={handleTypeFilterChange}
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
        subStatusFilter={subStatusFilter}
        handleSubStatusFilterChange={handleSubStatusFilterChange}
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
      <UserOrdersTableContent
        orders={paginatedOrders}
        loading={loading}
        columnVisibility={columnVisibility}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onViewDetails={handleViewDetails}
      />

      {/* Пагинация */}
      <UserOrdersTablePagination
        paginatedOrders={paginatedOrders}
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
