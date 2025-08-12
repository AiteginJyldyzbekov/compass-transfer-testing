'use client';

import { DataTablePagination, DataTableErrorState, DataTableLoader } from '@shared/ui/data-table';
import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteUser } from '@features/users/hooks';
import { UsersTableFilters, UsersTableContent } from './components';
import { useUsersTable } from './hooks/use-users-table';

export function UsersTable({
  initialRoleFilter,
}: {
  initialRoleFilter?: string;
}) {
  const {
    paginatedUsers,
    loading,
    error,
    searchTerm,
    emailFilter,
    phoneFilter,
    roleFilter,
    onlineFilter,
    showAdvancedFilters,
    currentPageNumber,
    pageSize,
    columnVisibility,
    totalCount,
    hasNext,
    hasPrevious,
    sortBy,
    sortOrder,
    setSearchTerm,
    setEmailFilter,
    setPhoneFilter,
    setOnlineFilter,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleRoleFilterChange,
    handleSort,
    loadUsers,
    router,
  } = useUsersTable(initialRoleFilter);

  // Хук для удаления пользователей
  const {
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  } = useDeleteUser({
    onSuccess: loadUsers, // Перезагружаем список после удаления
  });

  if (error) {
    return (
      <DataTableErrorState 
        error={error} 
        onRetry={loadUsers} 
        entityName="пользователей" 
      />
    );
  }

  return (
    <div className='space-y-4'>
      <UsersTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        emailFilter={emailFilter}
        setEmailFilter={setEmailFilter}
        phoneFilter={phoneFilter}
        setPhoneFilter={setPhoneFilter}
        roleFilter={roleFilter}
        handleRoleFilterChange={handleRoleFilterChange}
        onlineFilter={onlineFilter}
        setOnlineFilter={setOnlineFilter}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        columnVisibility={columnVisibility}
        handleColumnVisibilityChange={handleColumnVisibilityChange}
      />

      <DataTableLoader loading={loading} entityName="пользователей">
        <UsersTableContent
          paginatedUsers={paginatedUsers}
          columnVisibility={columnVisibility}
          router={router}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSort={handleSort}
          onDeleteUser={openDeleteModal}
        />

        <DataTablePagination
        currentItems={paginatedUsers}
        totalCount={totalCount}
        pageSize={pageSize}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        currentPageNumber={currentPageNumber}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleFirstPage={handleFirstPage}
        itemName="пользователей"
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
