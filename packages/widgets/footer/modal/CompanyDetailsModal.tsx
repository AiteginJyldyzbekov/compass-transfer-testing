'use client';

import React from 'react';

export interface CompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Модальное окно с реквизитами компании
 */
export const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            Наши реквизиты
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-6 space-y-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold  mb-2">ОсОО &quot;Компас Трансфер&quot;</h3>
              <div className="space-y-1">
                <p><span className="font-medium">ИНН:</span> [ИНН будет указан позже]</p>
                <p><span className="font-medium">ОКПО:</span> [ОКПО будет указан позже]</p>
                <p><span className="font-medium">Юридический адрес:</span> [адрес будет указан позже]</p>
                <p><span className="font-medium">Фактический адрес:</span> [адрес будет указан позже]</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold  mb-2">Банковские реквизиты</h4>
              <div className="space-y-1">
                <p><span className="font-medium">Банк:</span> ОАО «Оптима банк»</p>
                <p><span className="font-medium">Филиал:</span> [филиал будет указан позже]</p>
                <p><span className="font-medium">Адрес банка:</span> [адрес будет указан позже]</p>
                <p><span className="font-medium">БИК:</span> [БИК будет указан позже]</p>
                <p><span className="font-medium">Расчетный счет:</span> [расчетный счет будет указан позже]</p>
                <p><span className="font-medium">SWIFT:</span> [SWIFT будет указан позже]</p>
                <p><span className="font-medium">Менеджер банковского счета:</span> [ФИО менеджера будет указан позже]</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold  mb-2">Контактная информация</h4>
              <div className="space-y-1">
                <p><span className="font-medium">Телефон:</span> +[телефон будет указан позже]</p>
                <p><span className="font-medium">Email:</span> [email будет указан позже]</p>
                <p><span className="font-medium">Веб-сайт:</span> [website будет указан позже]</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold  mb-2">Руководство</h4>
              <div className="space-y-1">
                <p><span className="font-medium">Директор:</span> [Указать ФИО директора]</p>
                <p><span className="font-medium">Главный бухгалтер:</span> [Указать ФИО главного бухгалтера]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка закрытия */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}; 