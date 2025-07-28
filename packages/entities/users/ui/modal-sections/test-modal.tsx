'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/modals/dialog';
import { type PddTest } from '@entities/users/data/pdd-tests';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: PddTest | null;
  onComplete: (score: number) => void;
}

export function TestModal({ isOpen, onClose, test, onComplete }: TestModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];

    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (test && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    if (!test) return;

    // Подсчитываем правильные ответы
    let correctAnswers = 0;

    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / test.questions.length) * test.maxScore);

    setShowResults(true);
    onComplete(score);
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    onClose();
  };

  if (!test) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {test.name}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Вопрос {currentQuestion + 1} из {test.questions.length}
              </DialogDescription>
            </div>
          </div>
          {/* Прогресс-бар */}
          <div className='w-full bg-gray-200 rounded-full h-2 mt-4'>
            <div 
              className='bg-blue-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            />
          </div>
        </DialogHeader>
        
        <div className='space-y-6 p-6'>
          {!showResults ? (
            <>
              {/* Текущий вопрос */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium leading-relaxed'>
                  {test.questions[currentQuestion]?.question}
                </h3>
                
                {/* Варианты ответов */}
                <div className='space-y-3'>
                  {test.questions[currentQuestion]?.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      type='button'
                      variant={answers[currentQuestion] === optionIndex ? 'default' : 'outline'}
                      className='w-full text-left justify-start h-auto p-4 whitespace-normal'
                      onClick={() => selectAnswer(optionIndex)}
                    >
                      <span className='mr-3 font-bold'>
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Кнопки навигации */}
              <div className='flex justify-between pt-4 border-t'>
                <div className='text-sm text-gray-500'>
                  {answers[currentQuestion] !== undefined ? 'Ответ выбран' : 'Выберите ответ'}
                </div>
                <Button
                  type='button'
                  onClick={nextQuestion}
                  disabled={answers[currentQuestion] === undefined}
                  className='flex items-center gap-2'
                >
                  {currentQuestion < test.questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                  →
                </Button>
              </div>
            </>
          ) : (
            /* Результаты теста */
            <div className='text-center space-y-6'>
              <div className='space-y-2'>
                <h3 className='text-2xl font-bold text-green-600'>Тест завершен!</h3>
                <p className='text-gray-600'>Ваши результаты сохранены</p>
              </div>
              
              <div className='bg-gray-50 rounded-lg p-6 space-y-4'>
                <div className='grid grid-cols-2 gap-4 text-center'>
                  <div>
                    <div className='text-2xl font-bold text-blue-600'>
                      {Math.round((answers.filter((answer, index) => 
                        answer === test.questions[index]?.correctAnswer
                      ).length / test.questions.length) * 100)}%
                    </div>
                    <div className='text-sm text-gray-500'>Результат</div>
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-green-600'>
                      {answers.filter((answer, index) => 
                        answer === test.questions[index]?.correctAnswer
                      ).length}/{test.questions.length}
                    </div>
                    <div className='text-sm text-gray-500'>Правильных ответов</div>
                  </div>
                </div>
              </div>
              
              <Button
                type='button'
                onClick={handleClose}
                className='w-full'
              >
                Закрыть
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
