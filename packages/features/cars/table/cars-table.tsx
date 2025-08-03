'use client';

import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteCar } from '@features/cars/hooks';
import { CarsTableFilters, CarsTableContent, CarsTablePagination } from './components';
import { useCarsTable } from './hooks/use-cars-table';

export function CarsTable({
  initialFilters: _initialFilters,
}: {
  initialFilters?: {
    make?: string;
    model?: string;
    status?: string;
    type?: string;
    serviceClass?: string;
  };
}) {
  const {
    paginatedCars,
    loading,
    error,
    searchTerm,
    makeFilter,
    modelFilter,
    yearFilter,
    colorFilter,
    licensePlateFilter,
    typeFilter,
    serviceClassFilter,
    statusFilter,
    passengerCapacityFilter,
    featuresFilter,
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
    setMakeFilter,
    setModelFilter,
    setYearFilter,
    setLicensePlateFilter,
    setPassengerCapacityFilter,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleColorFilterChange,
    handleTypeFilterChange,
    handleServiceClassFilterChange,
    handleStatusFilterChange,
    handleFeaturesFilterChange,
    handleSort,
    loadCars,
    router,
    saveFilters,
    clearSavedFilters,
    hasSavedFilters,
    justSavedFilters,
  } = useCarsTable();

  // Хук для удаления автомобилей
  const {
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  } = useDeleteCar({
    onSuccess: loadCars, // Перезагружаем список после удаления
  });

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>Ошибка загрузки автомобилей: {error}</p>
          <button
            onClick={loadCars}
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
      <CarsTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        makeFilter={makeFilter}
        setMakeFilter={setMakeFilter}
        modelFilter={modelFilter}
        setModelFilter={setModelFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        colorFilter={colorFilter}
        handleColorFilterChange={handleColorFilterChange}
        licensePlateFilter={licensePlateFilter}
        setLicensePlateFilter={setLicensePlateFilter}
        typeFilter={typeFilter}
        handleTypeFilterChange={handleTypeFilterChange}
        serviceClassFilter={serviceClassFilter}
        handleServiceClassFilterChange={handleServiceClassFilterChange}
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
        passengerCapacityFilter={passengerCapacityFilter}
        setPassengerCapacityFilter={setPassengerCapacityFilter}
        featuresFilter={featuresFilter}
        handleFeaturesFilterChange={handleFeaturesFilterChange}
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

      <CarsTableContent
        paginatedCars={paginatedCars}
        columnVisibility={columnVisibility}
        router={router}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onDeleteCar={openDeleteModal}
      />

      {loading && (
        <div className='text-center py-4'>
          <p>Загрузка автомобилей...</p>
        </div>
      )}

      <CarsTablePagination
        paginatedCars={paginatedCars}
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
