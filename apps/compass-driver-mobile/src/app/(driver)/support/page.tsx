"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import Background from "@shared/icons/support/background.png"
import Image from 'next/image';

// FAQ Data - можно заменить на API запрос
const FAQ_DATA = [
  {
    id: 1,
    question: "Можно ли брать перерывы, когда хочу?",
    answer: "Конечно! Услуги — включают предложения и скидки. Нашим удачным клиентам доступен широкий выбор акций и скидок, а работникам — гибкие условия."
  },
  {
    id: 2,
    question: "Можно ли брать перерывы, когда хочу?",
    answer: "Конечно! Услуги — включают предложения и скидки. Нашим удачным клиентам доступен широкий выбор акций и скидок, а работникам — гибкие условия."
  },
  {
    id: 3,
    question: "Можно ли брать перерывы, когда хочу?",
    answer: "Конечно! Услуги — включают предложения и скидки. Нашим удачным клиентам доступен широкий выбор акций и скидок, а работникам — гибкие условия."
  },
  {
    id: 4,
    question: "Можно ли брать перерывы, когда хочу?",
    answer: "Конечно! Услуги — включают предложения и скидки. Нашим удачным клиентам доступен широкий выбор акций и скидок, а работникам — гибкие условия."
  },
  {
    id: 5,
    question: "Можно ли брать перерывы, когда хочу?",
    answer: "Конечно! Услуги — включают предложения и скидки. Нашим удачным клиентам доступен широкий выбор акций и скидок, а работникам — гибкие условия."
  },
  {
    id: 6,
    question: "Можно ли брать перерывы, когда хочу?",
    answer: "Конечно! Услуги — включают предложения и скидки. Нашим удачным клиентам доступен широкий выбор акций и скидок, а работникам — гибкие условия."
  }
];

export default function SupportBlocks() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id: any) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Two Blocks Container */}
      <div className="flex gap-3 p-6">
        {/* Left Block - With Background Image */}
        <div className="flex-1 relative h-48 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl overflow-hidden">
          {/* Background Image */}
          <Image
            src={Background}
            alt="Support background"
            className="absolute inset-0 w-full h-full object-cover"
            fill
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/20 p-4 flex flex-col justify-end gap-[10px]">
            <div>
              <h3 className="text-white text-[14px] font-medium mb-2 text-center">Возникли срочные вопросы?</h3>
              <div className="text-white text-[16px] font-medium">+996 700 700 700</div>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors w-full">
              Позвонить
            </button>
          </div>
        </div>

        {/* Right Block - No Background Image */}
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-48 flex flex-col">
          {/* Icon */}
          <div className="mb-3 flex justify-center">
            <MessageCircle className="w-6 h-6 text-gray-600" />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between gap-[5px]">
            <div>
              <h3 className="text-gray-900 text-sm font-medium mb-2 text-center">Свяжитесь с нами через онлайн-чат</h3>
              <p className="text-gray-600 text-xs leading-relaxed text-center">
                Наш специалист оперативно ответит на ваши вопросы
              </p>
            </div>

            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-colors w-full">
              Открыть чат
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Часто задаваемые вопросы</h3>
        </div>

        <div className="divide-y-[10px] divide-white rounded-[10px]">
          {FAQ_DATA.map((faqItem) => (
            <div key={faqItem.id} className="px-6 py-4 bg-[#F4F4F4]">
              <button
                onClick={() => toggleFAQ(faqItem.id)}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-sm font-medium text-gray-900 pr-4">
                  {faqItem.question}
                </span>
                {openFAQ === faqItem.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openFAQ === faqItem.id && (
                <div className="mt-3 text-sm text-gray-600 animate-in slide-in-from-top-1 duration-200">
                  <p>{faqItem.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}