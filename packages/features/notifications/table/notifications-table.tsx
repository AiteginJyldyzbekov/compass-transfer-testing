'use client';

import { DeleteConfirmationModal } from '@shared/ui/modals';
import { useDeleteNotification, useNotificationActions } from '@features/notifications/hooks';
import { NotificationsTableFilters, NotificationsTableContent, NotificationsTablePagination } from './components';
import { useNotificationsTable } from './hooks/use-notifications-table';

export function NotificationsTable({
  initialFilters: _initialFilters,
}: {
  initialFilters?: {
    type?: string;
    isRead?: string;
    orderType?: string;
    userId?: string;
  };
}) {
  const {
    filteredNotifications,
    paginatedNotifications,
    loading,
    error,
    searchTerm,
    contentFilter,
    typeFilter,
    orderTypeFilter,
    isReadFilter,
    userIdFilter,
    showAdvancedFilters,
    currentCursor,
    isFirstPage,
    currentPageNumber,
    pageSize,
    columnVisibility,
    totalPages,
    totalCount,
    hasNext,
    hasPrevious,
    sortBy,
    sortOrder,
    setSearchTerm,
    setContentFilter,
    setIsReadFilter,
    setUserIdFilter,
    setShowAdvancedFilters,
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
    handleColumnVisibilityChange,
    handleTypeFilterChange,
    handleOrderTypeFilterChange,
    handleSort,
    loadNotifications,
    router,
    showMyNotifications,
    toggleMyNotifications,
    saveFilters,
    clearSavedFilters,
    hasSavedFilters,
    justSavedFilters,
  } = useNotificationsTable();

  // Хук для удаления уведомлений
  const {
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  } = useDeleteNotification({
    onSuccess: loadNotifications, // Перезагружаем список после удаления
  });

  // Хук для действий с уведомлениями
  const {
    toggleReadStatus,
    isUpdating,
  } = useNotificationActions({
    onSuccess: loadNotifications, // Перезагружаем список после изменения статуса
  });

  // Обработчик для показа моих уведомлений
  const handleShowMyNotifications = () => {
    toggleMyNotifications();
  };

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>Ошибка загрузки уведомлений: {error}</p>
          <button
            onClick={loadNotifications}
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
      <NotificationsTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        contentFilter={contentFilter}
        setContentFilter={setContentFilter}
        typeFilter={typeFilter}
        handleTypeFilterChange={handleTypeFilterChange}
        orderTypeFilter={orderTypeFilter}
        handleOrderTypeFilterChange={handleOrderTypeFilterChange}
        isReadFilter={isReadFilter}
        setIsReadFilter={setIsReadFilter}
        userIdFilter={userIdFilter}
        setUserIdFilter={setUserIdFilter}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        columnVisibility={columnVisibility}
        handleColumnVisibilityChange={handleColumnVisibilityChange}
        onShowMyNotifications={handleShowMyNotifications}
        showMyNotifications={showMyNotifications}
        isUpdating={isUpdating}
        onSaveFilters={saveFilters}
        onClearSavedFilters={clearSavedFilters}
        hasSavedFilters={hasSavedFilters}
        justSavedFilters={justSavedFilters}
      />

      <NotificationsTableContent
        paginatedNotifications={paginatedNotifications}
        columnVisibility={columnVisibility}
        router={router}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onDeleteNotification={openDeleteModal}
        onToggleReadStatus={toggleReadStatus}
        showMyNotifications={showMyNotifications}
        isUpdating={isUpdating}
      />

      {loading && (
        <div className='text-center py-4'>
          <p>Загрузка уведомлений...</p>
        </div>
      )}

      <NotificationsTablePagination
        paginatedNotifications={paginatedNotifications}
        filteredNotifications={filteredNotifications}
        currentCursor={currentCursor}
        isFirstPage={isFirstPage}
        currentPageNumber={currentPageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
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
