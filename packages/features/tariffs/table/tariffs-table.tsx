'use client';

import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteTariff, useArchiveTariff } from '@features/tariffs/hooks';
import { TariffsTableFilters, TariffsTableContent, TariffsTablePagination } from './components';
import { useTariffsTable } from './hooks/use-tariffs-table';

export function TariffsTable({
  initialFilters: _initialFilters,
}: {
  initialFilters?: {
    name?: string;
    serviceClass?: string;
    carType?: string;
    archived?: string;
  };
}) {
  const {
    paginatedTariffs,
    loading,
    error,
    searchTerm,
    nameFilter,
    serviceClassFilter,
    carTypeFilter,
    basePriceFromFilter,
    basePriceToFilter,
    minutePriceFromFilter,
    minutePriceToFilter,
    archivedFilter,
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
    setBasePriceFromFilter,
    setBasePriceToFilter,
    setMinutePriceFromFilter,
    setMinutePriceToFilter,
    setArchivedFilter,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleServiceClassFilterChange,
    handleCarTypeFilterChange,
    handleSort,
    loadTariffs,
    router,
    saveFilters,
    clearSavedFilters,
    hasSavedFilters,
    justSavedFilters,
    handleArchivedFilterChange,
  } = useTariffsTable();

  // Хук для удаления тарифов
  const {
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  } = useDeleteTariff({
    onSuccess: loadTariffs, // Перезагружаем список после удаления
  });

  // Хук для архивирования тарифов
  const {
    toggleArchive,
    isArchiving,
  } = useArchiveTariff({
    onSuccess: loadTariffs, // Перезагружаем список после изменения статуса архива
  });

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>Ошибка загрузки тарифов: {error}</p>
          <button
            onClick={loadTariffs}
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
      <TariffsTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        serviceClassFilter={serviceClassFilter}
        handleServiceClassFilterChange={handleServiceClassFilterChange}
        carTypeFilter={carTypeFilter}
        handleCarTypeFilterChange={handleCarTypeFilterChange}
        basePriceFromFilter={basePriceFromFilter}
        setBasePriceFromFilter={setBasePriceFromFilter}
        basePriceToFilter={basePriceToFilter}
        setBasePriceToFilter={setBasePriceToFilter}
        minutePriceFromFilter={minutePriceFromFilter}
        setMinutePriceFromFilter={setMinutePriceFromFilter}
        minutePriceToFilter={minutePriceToFilter}
        setMinutePriceToFilter={setMinutePriceToFilter}
        archivedFilter={archivedFilter}
        setArchivedFilter={setArchivedFilter}
        handleArchivedFilterChange={handleArchivedFilterChange}
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

      <TariffsTableContent
        paginatedTariffs={paginatedTariffs}
        columnVisibility={columnVisibility}
        router={router}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onDeleteTariff={openDeleteModal}
        onToggleArchive={toggleArchive}
        isArchiving={isArchiving}
      />

      {loading && (
        <div className='text-center py-4'>
          <p>Загрузка тарифов...</p>
        </div>
      )}

      <TariffsTablePagination
        paginatedTariffs={paginatedTariffs}
        totalCount={totalCount}
        pageSize={pageSize}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        currentPageNumber={currentPageNumber}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
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
