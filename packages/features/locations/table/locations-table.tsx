'use client';

import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteLocation } from '@features/locations/hooks';
import { LocationsTableFilters, LocationsTableContent, LocationsTablePagination } from './components';
import { useLocationsTable } from './hooks/use-locations-table';

export function LocationsTable({
  initialFilters: _initialFilters,
}: {
  initialFilters?: {
    type?: string;
    city?: string;
    region?: string;
    isActive?: string;
    popular1?: string;
    popular2?: string;
  };
}) {
  const {
    filteredLocations,
    paginatedLocations,
    loading,
    error,
    searchTerm,
    nameFilter,
    addressFilter,
    districtFilter,
    cityFilter,
    countryFilter,
    regionFilter,
    typeFilter,
    isActiveFilter,
    popular1Filter,
    popular2Filter,
    showAdvancedFilters,
    currentPage,
    pageSize,
    columnVisibility,
    totalPages,
    sortBy,
    sortOrder,
    setSearchTerm,
    setNameFilter,
    setAddressFilter,
    setDistrictFilter,
    setCityFilter,
    setCountryFilter,
    setRegionFilter,
    setIsActiveFilter,
    setPopular1Filter,
    setPopular2Filter,
    setShowAdvancedFilters,
    handlePageChange,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleTypeFilterChange,
    handleSort,
    loadLocations,
    router,
    saveFilters,
    clearSavedFilters,
    hasSavedFilters,
    justSavedFilters,
    handleIsActiveFilterChange,
  } = useLocationsTable();

  // Хук для удаления локаций
  const {
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  } = useDeleteLocation({
    onSuccess: loadLocations, // Перезагружаем список после удаления
  });

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>Ошибка загрузки локаций: {error}</p>
          <button
            onClick={loadLocations}
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
      <LocationsTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        addressFilter={addressFilter}
        setAddressFilter={setAddressFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        typeFilter={typeFilter}
        handleTypeFilterChange={handleTypeFilterChange}
        isActiveFilter={isActiveFilter}
        setIsActiveFilter={setIsActiveFilter}
        handleIsActiveFilterChange={handleIsActiveFilterChange}
        popular1Filter={popular1Filter}
        setPopular1Filter={setPopular1Filter}
        popular2Filter={popular2Filter}
        setPopular2Filter={setPopular2Filter}
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

      <LocationsTableContent
        paginatedLocations={paginatedLocations}
        columnVisibility={columnVisibility}
        router={router}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onDeleteLocation={openDeleteModal}
      />

      {loading && (
        <div className='text-center py-4'>
          <p>Загрузка локаций...</p>
        </div>
      )}

      <LocationsTablePagination
        paginatedLocations={paginatedLocations}
        filteredLocations={filteredLocations}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
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
