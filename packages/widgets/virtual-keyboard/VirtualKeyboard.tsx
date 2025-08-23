'use client';

import React from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onClose: () => void;
  className?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  onClose,
  className = ''
}) => {
  // Раскладка клавиатуры для русского и английского
  const russianKeys = [
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
  ];

  const englishKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const [isRussian, setIsRussian] = React.useState(true);
  const [isUpperCase, setIsUpperCase] = React.useState(false);

  const currentKeys = isRussian ? russianKeys : englishKeys;

  const handleKeyPress = (key: string) => {
    const finalKey = isUpperCase ? key.toUpperCase() : key;

    onKeyPress(finalKey);
  };

  const toggleLanguage = () => {
    setIsRussian(!isRussian);
  };

  const toggleCase = () => {
    setIsUpperCase(!isUpperCase);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-300 shadow-2xl z-50 ${className}`}>
      <div className="p-6 max-w-6xl mx-auto">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-red-500 text-white rounded-xl font-bold text-[20px] hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
 

        {/* Цифры */}
        <div className="flex gap-2 mb-4 justify-center">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => onKeyPress(num)}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-xl text-[20px] font-semibold transition-colors"
            >
              {num}
            </button>
          ))}
        </div>

        {/* Основные буквы */}
        <div className="flex flex-col gap-3 mb-4">
          {currentKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="w-16 h-16 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl text-[18px] font-semibold transition-colors"
                >
                  {isUpperCase ? key.toUpperCase() : key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Специальные кнопки */}
        <div className="flex gap-3 justify-center items-center">
          {/* Переключение языка */}
          <button
            onClick={toggleLanguage}
            className="px-6 h-16 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-[16px] transition-colors"
          >
            {isRussian ? 'EN' : 'РУ'}
          </button>

          {/* Переключение регистра */}
          <button
            onClick={toggleCase}
            className={`px-6 h-16 rounded-xl font-bold text-[16px] transition-colors ${
              isUpperCase 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {isUpperCase ? 'АБВ' : 'абв'}
          </button>

          {/* Пробел */}
          <button
            onClick={() => onKeyPress(' ')}
            className="px-12 h-16 bg-gray-300 hover:bg-gray-400 rounded-xl font-bold text-[16px] transition-colors"
          >
            ПРОБЕЛ
          </button>

          {/* Backspace */}
          <button
            onClick={onBackspace}
            className="px-6 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-[16px] transition-colors"
          >
            ⌫
          </button>

          {/* Очистить все */}
          <button
            onClick={onClear}
            className="px-6 h-16 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-[16px] transition-colors"
          >
            ОЧИСТИТЬ
          </button>
        </div>
      </div>
    </div>
  );
}; 