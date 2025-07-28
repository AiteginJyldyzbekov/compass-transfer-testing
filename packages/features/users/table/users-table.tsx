'use client';


import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteUser } from '@features/users/hooks';
import { UsersTableFilters, UsersTableContent, UsersTablePagination } from './components';
import { useUsersTable } from './hooks/use-users-table';

export function UsersTable({
  initialRoleFilter: _initialRoleFilter,
}: {
  initialRoleFilter?: string;
}) {
  const {
    filteredUsers,
    paginatedUsers,
    loading,
    error,
    searchTerm,
    emailFilter,
    phoneFilter,
    roleFilter,
    onlineFilter,
    showAdvancedFilters,
    currentPage,
    pageSize,
    columnVisibility,
    totalPages,
    sortBy,
    sortOrder,
    setSearchTerm,
    setEmailFilter,
    setPhoneFilter,
    setOnlineFilter,
    setShowAdvancedFilters,
    handlePageChange,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleRoleFilterChange,
    handleSort,
    loadUsers,
    router,
  } = useUsersTable();

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
      <div className='space-y-4'>
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>Ошибка загрузки пользователей: {error}</p>
          <button
            onClick={loadUsers}
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

      <UsersTableContent
        paginatedUsers={paginatedUsers}
        columnVisibility={columnVisibility}
        router={router}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onDeleteUser={openDeleteModal}
      />

      {loading && (
        <div className='text-center py-4'>
          <p>Загрузка пользователей...</p>
        </div>
      )}

      <UsersTablePagination
        paginatedUsers={paginatedUsers}
        filteredUsers={filteredUsers}
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
