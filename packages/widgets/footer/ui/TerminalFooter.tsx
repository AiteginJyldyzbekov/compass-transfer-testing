'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { CompanyDetailsModal, PrivacyPolicyModal, FAQModal } from '../modal';

export interface TerminalFooterProps {
  className?: string;
}

export const TerminalFooter: React.FC<TerminalFooterProps> = ({ className }) => {
  const t = useTranslations();
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showPublicOffer, setShowPublicOffer] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleShowCompanyDetails = () => {
    setShowCompanyDetails(true);
  };

  const handleShowPublicOffer = () => {
    setShowPublicOffer(true);
  };

  const handleShowPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
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
    </footer>
  );
}; 