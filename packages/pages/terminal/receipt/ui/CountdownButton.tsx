'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface CountdownButtonProps {
  initialSeconds: number;
  targetPath: string;
  buttonText: string;
  className?: string;
  handleClick?: () => void;
}

export const CountdownButton: React.FC<CountdownButtonProps> = ({
  initialSeconds = 60,
  targetPath = '/',
  buttonText = 'На главную',
  className = '',
  handleClick,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const router = useRouter();

  useEffect(() => {
    if (seconds <= 0) {
      handleClick?.();
      router.push(targetPath);

      return;
    }

    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, router, targetPath]);

  const returnToMainPage = () => {
    handleClick?.();
    router.push(targetPath);
  };

  return (
    <button
      className={`w-[610px] m-auto mb-[120px] h-[124px] flex items-center justify-center flex-1 rounded-[100px] bg-gradient-to-r from-[#0053BF] to-[#2F79D8] ${className}`}
      onClick={returnToMainPage}
    >
      <span className="text-[46px] text-[#F5F6F7] font-bold leading-[100%]">
        {buttonText} {seconds < 10 ? `0:0${seconds}` : `0:${seconds}`}
      </span>
    </button>
  );
};

export default CountdownButton;
