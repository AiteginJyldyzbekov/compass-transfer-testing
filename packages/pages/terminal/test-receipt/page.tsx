'use client';

import React, { useState } from 'react';
import { generateFullReceiptPNG } from '@shared/utils/receiptGenerator';

export default function TestReceiptPage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const testData = {
    orderNumber: '123456',
    date: '05.09.25',
    time: '19:30',
    driver: {
      fullName: 'Иванов Иван Иванович',
      phoneNumber: '+996 555 123 456'
    },
    car: {
      make: 'Toyota',
      model: 'Camry',
      licensePlate: '01KG123ABC',
      color: 'Белый'
    },
    route: 'Аэропорт → Центр города',
    price: 150.50,
    queueNumber: 'Q001'
  };

  const handleGenerateReceipt = async () => {
    setIsGenerating(true);
    try {
      const pngBase64 = await generateFullReceiptPNG(testData);
      setGeneratedImage(`data:image/png;base64,${pngBase64}`);
    } catch (error) {
      console.error('Ошибка генерации чека:', error);
      alert('Ошибка генерации чека: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Тест генерации чека PNG</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Тестовые данные</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <button
            onClick={handleGenerateReceipt}
            disabled={isGenerating}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {isGenerating ? 'Генерируем...' : 'Сгенерировать чек PNG'}
          </button>
        </div>

        {generatedImage && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Сгенерированный чек</h2>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-white">
              <img
                src={generatedImage}
                alt="Сгенерированный чек"
                className="max-w-full h-auto mx-auto border border-gray-200"
                style={{ maxWidth: '384px', minWidth: '384px' }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Размер: 384px ширина (стандарт для термопринтеров)</p>
              <p>Формат: PNG с белым фоном</p>
              <p>DPI: 2x для высокого качества печати</p>
              <p>Шрифты: 20px заголовок, 14px основной текст</p>
              <p>Логотип: до 80px высоты</p>
              <p>Убран дублирующий текст "COMPASS TRANSFER"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
