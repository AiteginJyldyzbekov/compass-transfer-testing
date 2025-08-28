'use client';

import { User, Bell, Shield, HelpCircle, LogOut, Moon, ChevronDown, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { logger } from '@shared/lib';
import Link from 'next/link';
import { ChangePasswordModal } from "@features/auth/ui/modal/change-password-modal"
import { useDriverProfile } from '@features/driver-profile/model/hooks/useDriverProfile';

interface FormData {
  fullName: string;
  phoneNumber: string;
}


export default function SettingsPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { actions } = useDriverProfile();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
  });

  const [language, setLanguage] = useState('Русский');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [iconSize, setIconSize] = useState('medium');

  const languages = [
    { code: 'ru', name: 'Русский', flag: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Cpath fill='%23fff' d='M0 0h3v2H0z'/%3E%3Cpath fill='%23d52b1e' d='M0 0h3v.67H0z'/%3E%3Cpath fill='%230039a6' d='M0 .67h3v.67H0z'/%3E%3Cpath fill='%23d52b1e' d='M0 1.33h3V2H0z'/%3E%3C/svg%3E" },
    { code: 'en', name: 'English', flag: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Cpath fill='%23012169' d='M0 0h60v30H0z'/%3E%3Cpath fill='%23fff' d='m0 0 60 30m0-30L0 30'/%3E%3Cpath stroke='%23C8102E' stroke-width='6' d='m0 0 60 30m0-30L0 30'/%3E%3Cpath stroke='%23fff' stroke-width='10' d='M30 0v30M0 15h60'/%3E%3Cpath stroke='%23C8102E' stroke-width='6' d='M30 0v30M0 15h60'/%3E%3C/svg%3E" },
    { code: 'de', name: 'Deutsch', flag: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 3'%3E%3Cpath fill='%23000' d='M0 0h5v1H0z'/%3E%3Cpath fill='%23D00' d='M0 1h5v1H0z'/%3E%3Cpath fill='%23FFCE00' d='M0 2h5v1H0z'/%3E%3C/svg%3E" }
  ];

  const selectedLanguage = languages.find(lang => lang.name === language);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSunClick = () => {
    setIsDarkMode(false);
  };

  const handleMoonClick = () => {
    setIsDarkMode(true);
  };


  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Вызываем API route для очистки куки
      const logoutResponse = await fetch('/api/Auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (logoutResponse.ok) {
        // Перенаправляем на страницу входа
        window.location.href = '/login';
      } else {
        logger.error('Ошибка при выходе из системы');
      }
    } catch (error) {
      logger.error('Ошибка при выходе:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    actions.getDriverSelf().then((data) => {
      setFormData({
        fullName: data?.fullName || "",
        phoneNumber: data?.phoneNumber || "",
      });
    })
  }, [])

  return (
    <div className='min-h-full bg-gray-50 p-4'>
      <div className='max-w-md mx-auto'>
        {/* Заголовок */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 flex items-center'>
            Настройки
          </h1>
        </div>

        {/* Группы настроек */}
        <div className='space-y-4'>
          {/* Профиль */}
          <div className='bg-[#F9F9F9] rounded-2xl shadow-sm'>
            {/* <div className='p-4 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-900'>Профиль</h2>
            </div>
            <div className='p-4 space-y-3'>
              <Link href={"/profile"}>
                <div className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer'>
                  <User className='w-5 h-5 text-gray-600' />
                  <span className='text-gray-900'>Личные данные</span>
                </div>
              </Link>
            </div> */}
            <div className="bg-white">
              {/* Форма */}
              <div className="px-4 space-y-6">
                {/* ФИО */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Информация об акаунте
                  </label>
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-1">
                      ФИО
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      readOnly
                      className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Телефон */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      readOnly
                      className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Пароль */}
                  <div className="mb-6">
                    <label className="block text-xs text-gray-500 mb-1">
                      Пароль
                    </label>
                    <div className="relative">
                      <div className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 flex items-center justify-between">
                        <span className="tracking-widest text-lg">********</span>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11c.828 0 1.5.672 1.5 1.5V15h-3v-2.5c0-.828.672-1.5 1.5-1.5z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8V7a5 5 0 00-10 0v1H5v14h14V8h-2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Кнопки */}
              <div className="bg-white p-4 space-y-3">
                <Link href={"/profile"}>
                  <button
                    className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Редактировать данные
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Безопасность */}
          {/* <div className='bg-white rounded-2xl shadow-sm'>
            <div className='p-4 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-900'>Безопасность</h2>
            </div>
            <div className='p-4 space-y-3'>
              <div
                onClick={() => setIsPasswordModalOpen(true)}
                className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer'
              >
                <Shield className='w-5 h-5 text-gray-600' />
                <span className='text-gray-900'>Изменить пароль</span>
              </div>
              {isPasswordModalOpen && (<ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />)}
            </div>
          </div> */}

          {/* Помощь */}
          {/* <div className='bg-white rounded-2xl shadow-sm'>
            <div className='p-4 border-b border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-900'>Помощь</h2>
            </div>
            <div className='p-4 space-y-3'>
              <div className='flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer'>
                <HelpCircle className='w-5 h-5 text-gray-600' />
                <span className='text-gray-900'>Поддержка</span>
              </div>
            </div>
          </div> */}

          {/* Выход */}
          {/* <div className='bg-white rounded-2xl shadow-sm'>
            <div className='p-4'>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className='w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoggingOut ? (
                  <div className='w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                ) : (
                  <LogOut className='w-5 h-5 text-red-600' />
                )}
                <span className='text-red-600 font-medium'>
                  {isLoggingOut ? 'Выход...' : 'Выйти из аккаунта'}
                </span>
              </button>
            </div>
          </div> */}
          <div className="w-full bg-white p-6 space-y-8">
            {/* Язык */}
            <div className="space-y-3 bg-[#F9F9F9] p-[10px] rounded-[10px] flex items-center justify-between">
              <h3 className="text-sm text-gray-500 font-normal">Язык</h3>
              <div className="relative">
                <div
                  className="flex items-center w-full bg-white border border-gray-200 rounded-lg px-3 py-3 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                >
                  <img
                    src={selectedLanguage?.flag}
                    alt={selectedLanguage?.name}
                    className="w-4 h-3 mr-3"
                  />
                  <span className="text-sm text-gray-900 flex-1">{language}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transform transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Выпадающий список */}
                {isLanguageOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {languages.map((lang) => (
                      <div
                        key={lang.code}
                        className="flex items-center px-3 py-3 hover:bg-gray-50 cursor-pointer transition-colors first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => {
                          setLanguage(lang.name);
                          setIsLanguageOpen(false);
                        }}
                      >
                        <img src={lang.flag} alt={lang.name} className="w-4 h-3 mr-3" />
                        <span className="text-sm text-gray-900">{lang.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Интерфейс */}
            <div className="space-y-4 flex items-center justify-between bg-[#F9F9F9] p-[10px] rounded-[10px]">
              <h3 className="text-sm text-gray-500 font-normal">Интерфейс</h3>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleSunClick}
                  className={`p-1 rounded transition-colors ${!isDarkMode ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Sun className="w-5 h-5" />
                </button>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isDarkMode}
                    onChange={handleThemeToggle}
                  />
                  <div className={`w-14 h-7 rounded-full transition-colors duration-300 relative ${isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-out mt-0.5 ${isDarkMode ? 'translate-x-7' : 'translate-x-0.5'
                      }`} />
                  </div>
                </label>

                <button
                  onClick={handleMoonClick}
                  className={`p-1 rounded transition-colors ${isDarkMode ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Размер шрифта */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-500 font-normal">Размер шрифта</h3>
              <div className="px-2">
                <div className="relative">
                  <input
                    type="range"
                    min="10"
                    max="18"
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer outline-none"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((fontSize - 10) / 8) * 100}%, #E5E7EB ${((fontSize - 10) / 8) * 100}%, #E5E7EB 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-3 px-1">
                  <button
                    onClick={() => setFontSize(10)}
                    className={`transition-colors ${fontSize === 10 ? 'text-blue-500 font-medium' : 'hover:text-gray-600'}`}
                  >
                    10
                  </button>
                  <button
                    onClick={() => setFontSize(12)}
                    className={`transition-colors ${fontSize === 12 ? 'text-blue-500 font-medium' : 'hover:text-gray-600'}`}
                  >
                    12
                  </button>
                  <button
                    onClick={() => setFontSize(14)}
                    className={`transition-colors ${fontSize === 14 ? 'text-blue-500 font-medium' : 'hover:text-gray-600'}`}
                  >
                    14
                  </button>
                  <button
                    onClick={() => setFontSize(16)}
                    className={`transition-colors ${fontSize === 16 ? 'text-blue-500 font-medium' : 'hover:text-gray-600'}`}
                  >
                    16
                  </button>
                  <button
                    onClick={() => setFontSize(18)}
                    className={`transition-colors ${fontSize === 18 ? 'text-blue-500 font-medium' : 'hover:text-gray-600'}`}
                  >
                    18
                  </button>
                </div>
              </div>
            </div>

            {/* Размер значков */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-500 font-normal">Размер значков</h3>
              <div className="flex">
                <button
                  onClick={() => setIconSize('small')}
                  className={`flex-1 py-3 text-sm transition-colors hover:text-blue-400 ${iconSize === 'small'
                    ? 'text-blue-500 font-medium'
                    : 'text-gray-500'
                    }`}
                >
                  Маленький
                </button>
                <button
                  onClick={() => setIconSize('medium')}
                  className={`flex-1 py-3 text-sm transition-colors hover:text-blue-400 ${iconSize === 'medium'
                    ? 'text-blue-500 font-medium'
                    : 'text-gray-500'
                    }`}
                >
                  Средний
                </button>
                <button
                  onClick={() => setIconSize('large')}
                  className={`flex-1 py-3 text-sm transition-colors hover:text-blue-400 ${iconSize === 'large'
                    ? 'text-blue-500 font-medium'
                    : 'text-gray-500'
                    }`}
                >
                  Большой
                </button>
              </div>
              <div className="relative px-2">
                <div className="h-1 bg-gray-200 rounded-lg">
                  <div
                    className="absolute top-0 w-4 h-4 bg-blue-500 rounded-full shadow-md transform -translate-y-1.5 transition-all duration-200"
                    style={{
                      left: iconSize === 'small' ? '0%' : iconSize === 'medium' ? '50%' : '100%',
                      marginLeft: iconSize === 'small' ? '0px' : iconSize === 'medium' ? '-8px' : '-16px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Закрытие выпадающего списка при клике вне его */}
            {isLanguageOpen && (
              <div
                className="fixed inset-0 z-0"
                onClick={() => setIsLanguageOpen(false)}
              />
            )}

            <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
      `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
