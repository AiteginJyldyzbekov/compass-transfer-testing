'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
// Simple FAQ structure since @entities/faq is not available
const FAQ_QUESTIONS = [
  {
    id: '1',
    questionKey: 'howToOrder',
    answerKey: 'howToOrderAnswer'
  },
  {
    id: '2', 
    questionKey: 'paymentMethods',
    answerKey: 'paymentMethodsAnswer'
  },
  {
    id: '3',
    questionKey: 'cancellation',
    answerKey: 'cancellationAnswer'
  }
] as const;

type FAQItem = typeof FAQ_QUESTIONS[number];

export interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Модальное окно с часто задаваемыми вопросами для терминала Compass Transfer
 */
export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const t = useTranslations();

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);

    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
        {/* Заголовок - фиксированный */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold">
            {t('FAQ.title')}
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

        {/* Содержимое - скроллируемое */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {FAQ_QUESTIONS.map((item: FAQItem) => {
              const isExpanded = expandedItems.has(item.id);
              
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium  pr-4">
                      {t(`FAQ.questions.${item.questionKey}`)}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-3 border-t border-gray-100">
                      <div className="pt-3 max-h-40 overflow-y-auto">
                        <p className="leading-relaxed">
                          {t(`FAQ.questions.${item.answerKey}`)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Контактная информация */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold  mb-2">
              {t('FAQ.contactTitle')}
            </h3>
            <p className="mb-2">
              {t('FAQ.contactDescription')}
            </p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">{t('FAQ.phone')}:</span> +[телефон будет указан позже]</p>
              <p><span className="font-medium">{t('FAQ.email')}:</span> [email будет указан позже]</p>
              <p><span className="font-medium">{t('FAQ.workingHours')}:</span> {t('FAQ.workingHoursValue')}</p>
            </div>
          </div>
        </div>

        {/* Футер - фиксированный */}
        <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('FAQ.close')}
          </button>
        </div>
      </div>
    </div>
  );
}; 