'use client';

import { DataTablePagination, DataTableErrorState } from '@shared/ui/data-table';
import { OrderType } from '@entities/orders/enums/OrderType.enum';
import { getOrderViewRoute } from '@entities/orders/utils/order-routes';
import { UserOrdersTableFilters, UserOrdersTableContent } from './components';
import { useUserOrdersTable } from './hooks/use-user-orders-table';

interface UserOrdersTableProps {
  userId: string;
}

export function UserOrdersTable({
  initialFilters,
  userId,
}: {
  initialFilters?: {
    status?: string;
    orderType?: string;
    dateFrom?: string;
    dateTo?: string;
  };
} & UserOrdersTableProps) {
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
  } = useUserOrdersTable(initialFilters, userId);

  const handleViewDetails = (orderId: string, orderType: string) => {
    // Преобразуем строку в enum
    const orderTypeEnum = orderType as keyof typeof OrderType;
    const route = getOrderViewRoute(orderId, OrderType[orderTypeEnum] || OrderType.Instant);

    window.open(route, '_blank');
  };

  if (error) {
    return (
      <DataTableErrorState 
        error={error} 
        onRetry={refetch} 
        entityName="заказов" 
      />
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
      <DataTablePagination
        currentItems={paginatedOrders}
        totalCount={totalCount}
        pageSize={pageSize}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        currentPageNumber={currentPageNumber}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFirstPage={handleFirstPage}
        itemName="заказов пользователя"
      />
    </div>
  );
}
