'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { QuestionCircleIcon } from '@shared/icons';
import { useLanguages } from '@shared/language';
import { useTranslations } from 'next-intl';
import { FAQModal } from '@widgets/footer/modal';

export const FixedLanguageButtons: React.FC = () => {
  const { languages, handleLanguageChange, currentLanguage } = useLanguages();
  const [showFAQModal, setShowFAQModal] = useState(false);
  const t = useTranslations();

  const handleHelpClick = () => {
    setShowFAQModal(true);
  };

  return (
    <>
      {/* Фиксированные кнопки языков и FAQ */}
      <div className="fixed bottom-40 left-4 right-4 z-40 flex justify-between items-center">
        {/* Кнопки языков */}
        <div className="flex gap-4">
          {languages.map(item => (
            <button
              onClick={() => handleLanguageChange(item.locale)}
              key={item.locale}
              className={`w-[150px] max-w-[150px] p-4 text-[#FFFFFF] text-[28px] font-bold rounded-2xl flex items-center gap-3 cursor-pointer shadow-lg ${
                item.locale === currentLanguage ? 'bg-[#0047FF]' : 'bg-[#0A205747]'
              }`}
            >
              {/* Флаг языка с оптимизацией */}
              <Image
                src={item.icon}
                alt={`${item.name} flag`}
                width={32}
                height={24}
                className="rounded-sm"
                priority={item.locale === currentLanguage}
                loading={item.locale === currentLanguage ? 'eager' : 'lazy'}
              />
              {item.name}
            </button>
          ))}
        </div>

        {/* Кнопка FAQ */}
        <button
          type="button"
          onClick={handleHelpClick}
          className="flex items-center gap-2 text-white text-[28px] font-bold bg-[#0A205747] p-4 rounded-2xl cursor-pointer hover:bg-[#0A205760] transition-colors shadow-lg"
        >
          {t('MainTerminal.helpButton')}{' '}
          <QuestionCircleIcon
            size={28}
            className="text-white"
          />
        </button>
      </div>

      {/* FAQ Modal */}
      <FAQModal 
        isOpen={showFAQModal} 
        onClose={() => setShowFAQModal(false)} 
      />
    </>
  );
};
