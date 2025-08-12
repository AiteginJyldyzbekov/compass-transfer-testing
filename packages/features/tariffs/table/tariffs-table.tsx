'use client';

import { DataTablePagination, DataTableErrorState, DataTableLoader } from '@shared/ui/data-table';
import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteTariff, useArchiveTariff } from '@features/tariffs/hooks';
import { TariffsTableFilters, TariffsTableContent } from './components';
import { useTariffsTable } from './hooks/use-tariffs-table';

export function TariffsTable({
  initialFilters,
}: {
  initialFilters?: {
    name?: string;
    priceFrom?: string;
    priceTo?: string;
    isActive?: string;
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
    handleFirstPage,
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
  } = useTariffsTable(initialFilters);

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
      <DataTableErrorState 
        error={error} 
        onRetry={loadTariffs} 
        entityName="тарифов" 
      />
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

      <DataTableLoader loading={loading} entityName="тарифов">
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

        <DataTablePagination
          currentItems={paginatedTariffs}
          totalCount={totalCount}
          pageSize={pageSize}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          currentPageNumber={currentPageNumber}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handleFirstPage={handleFirstPage}
          itemName="тарифов"
        />
      </DataTableLoader>

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
