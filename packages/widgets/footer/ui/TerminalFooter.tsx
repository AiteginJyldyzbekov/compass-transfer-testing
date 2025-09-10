'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { CompanyDetailsModal, PrivacyPolicyModal, FAQModal } from '../modal';
import { QuestionCircleIcon } from '@shared/icons';
import { useLanguages } from '@shared/language';

export interface TerminalFooterProps {
  className?: string;
}

export const TerminalFooter: React.FC<TerminalFooterProps> = ({ className }) => {
  const t = useTranslations();
  const { languages, handleLanguageChange, currentLanguage } = useLanguages();
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showPublicOffer, setShowPublicOffer] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  const handleShowCompanyDetails = () => {
    setShowCompanyDetails(true);
  };

  const handleShowPublicOffer = () => {
    setShowPublicOffer(true);
  };

  const handleShowPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };

  const handleHelpClick = () => {
    setShowFAQModal(true);
  };

  return (
    <footer 
      className={clsx(
        // Основные стили футера из дизайна
        'w-full px-20 py-4',
        // // Градиент: Linear Gradient · 30% #0047FF to #0047FF00 (снизу вверх)
        // 'bg-gradient-to-t from-[#0047FF]/30 to-[#0047FF]/0',
        'flex flex-col items-center gap-2',
        className
      )}
    >
      {/* Кнопки языков и FAQ - выше контента футера */}
      <div className="fixed bottom-0 left-4 right-4 z-40 flex justify-between items-center mb-4">
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

      {/* Контейнер для логотипа */}
      <div className="flex items-center gap-4">
        {/* Основной логотип Compass */}
        <div className="flex flex-col items-start">
          {/* SVG логотип Compass */}
          <Image
            src="/logo/logofooter.png"
            alt="Compass Logo"
            width={226}
            height={37}
            quality={100}
            className="w-56 h-auto"
            priority
          />
        </div>
      </div>

      {/* Кнопки с документами */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
        <button
          onClick={handleShowCompanyDetails}
          className="text-white/80 hover:text-white transition-colors text-sm hover:underline-offset-4 font-bold"
        >
          {t('Footer.companyDetails')}
        </button>
        
        <span className="hidden sm:block text-white/60">•</span>
        
        <button
          onClick={handleShowPublicOffer}
          className="text-white/80 hover:text-white transition-colors text-sm hover:underline-offset-4 font-bold"
        >
          {t('Footer.publicOffer')}
        </button>
        
        <span className="hidden sm:block text-white/60">•</span>
        
        <button
          onClick={handleShowPrivacyPolicy}
          className="text-white/80 hover:text-white transition-colors text-sm hover:underline-offset-4 font-bold"
        >
          {t('Footer.privacyPolicy')}
        </button>
      </div>

      {/* Модальные окна */}
      <CompanyDetailsModal 
        isOpen={showCompanyDetails} 
        onClose={() => setShowCompanyDetails(false)} 
      />
      <FAQModal 
        isOpen={showPublicOffer} 
        onClose={() => setShowPublicOffer(false)} 
      />
      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy} 
        onClose={() => setShowPrivacyPolicy(false)} 
      />
      <FAQModal 
        isOpen={showFAQModal} 
        onClose={() => setShowFAQModal(false)} 
      />
    </footer>
  );
}; 