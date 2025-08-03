'use client';

import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteService } from '@features/services/hooks';
import { ServicesTableFilters, ServicesTableContent, ServicesTablePagination } from './components';
import { useServicesTable } from './hooks/use-services-table';

export function ServicesTable({
  initialFilters: _initialFilters,
}: {
  initialFilters?: {
    name?: string;
    priceFrom?: string;
    priceTo?: string;
    isQuantifiable?: string;
  };
}) {
  const {
    paginatedServices,
    loading,
    error,
    searchTerm,
    nameFilter,
    priceFromFilter,
    priceToFilter,
    isQuantifiableFilter,
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
    setNameFilter,
    setPriceFromFilter,
    setPriceToFilter,
    setIsQuantifiableFilter,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleIsQuantifiableFilterChange,
    handleSort,
    loadServices,
    router,
    saveFilters,
    clearSavedFilters,
    hasSavedFilters,
    justSavedFilters,
  } = useServicesTable();

  // Хук для удаления услуг
  const {
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  } = useDeleteService({
    onSuccess: loadServices, // Перезагружаем список после удаления
  });

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>Ошибка загрузки услуг: {error}</p>
          <button
            onClick={loadServices}
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
      <ServicesTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        priceFromFilter={priceFromFilter}
        setPriceFromFilter={setPriceFromFilter}
        priceToFilter={priceToFilter}
        setPriceToFilter={setPriceToFilter}
        isQuantifiableFilter={isQuantifiableFilter}
        setIsQuantifiableFilter={setIsQuantifiableFilter}
        handleIsQuantifiableFilterChange={handleIsQuantifiableFilterChange}
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

      <ServicesTableContent
        paginatedServices={paginatedServices}
        columnVisibility={columnVisibility}
        router={router}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onDeleteService={openDeleteModal}
      />

      {loading && (
        <div className='text-center py-4'>
          <p>Загрузка услуг...</p>
        </div>
      )}

      <ServicesTablePagination
        paginatedServices={paginatedServices}
        totalCount={totalCount}
        pageSize={pageSize}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        currentPageNumber={currentPageNumber}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFirstPage={handleFirstPage}
      />

      {/* Модальное окно удаления */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        {...getDeleteModalProps()}
      />
    </div>
  );
}
