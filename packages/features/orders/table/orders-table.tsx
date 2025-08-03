'use client';

import { OrdersTableFilters, OrdersTableContent, OrdersTablePagination } from './components';
import { useOrdersTable } from './hooks/use-orders-table';

export function OrdersTable({
  initialFilters,
}: {
  initialFilters?: {
    orderNumber?: string;
    type?: string;
    status?: string;
    subStatus?: string;
    creatorId?: string;
    airFlight?: string;
    flyReis?: string;
  };
}) {
  const {
    paginatedOrders,
    loading,
    error,
    searchTerm,
    typeFilter,
    statusFilter,
    subStatusFilter,
    creatorIdFilter,
    airFlightFilter,
    flyReisFilter,
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
    setCreatorIdFilter,
    setAirFlightFilter,
    setFlyReisFilter,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleTypeFilterChange,
    handleStatusFilterChange,
    handleSubStatusFilterChange,
    handleSort,
    loadOrders,
    router,
    saveFilters,
    clearSavedFilters,
    hasSavedFilters,
    justSavedFilters,
    refetch,
  } = useOrdersTable(initialFilters);

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>Ошибка загрузки заказов: {error}</p>
          <button
            onClick={loadOrders}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <OrdersTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        handleTypeFilterChange={handleTypeFilterChange}
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
        subStatusFilter={subStatusFilter}
        handleSubStatusFilterChange={handleSubStatusFilterChange}
        creatorIdFilter={creatorIdFilter}
        setCreatorIdFilter={setCreatorIdFilter}
        airFlightFilter={airFlightFilter}
        setAirFlightFilter={setAirFlightFilter}
        flyReisFilter={flyReisFilter}
        setFlyReisFilter={setFlyReisFilter}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        columnVisibility={columnVisibility}
        handleColumnVisibilityChange={handleColumnVisibilityChange}
        onSaveFilters={saveFilters}
        onClearSavedFilters={clearSavedFilters}
        hasSavedFilters={hasSavedFilters}
        justSavedFilters={justSavedFilters}
      />

      <OrdersTableContent
        paginatedOrders={paginatedOrders}
        columnVisibility={columnVisibility}
        router={router}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onRefetch={refetch}
      />

      {loading && (
        <div className='text-center py-4'>
          <p>Загрузка заказов...</p>
        </div>
      )}

      <OrdersTablePagination
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
