'use client'

import { useState } from 'react';

export interface UsePasswordLogicReturn {
  showPassword: boolean;
  showConfirmPassword: boolean;
  confirmPassword: string;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setConfirmPassword: (password: string) => void;
  hasCyrillic: (text: string) => boolean;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  getPasswordMatchStatus: (password: string, confirmPassword?: string) => 'match' | 'mismatch' | 'empty';
}

/**
 * Хук для управления логикой паролей в формах создания пользователей
 */
export function usePasswordLogic(): UsePasswordLogicReturn {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // Проверка на кириллицу
  const hasCyrillic = (text: string) => /[а-яё]/i.test(text);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const getPasswordMatchStatus = (password: string, confirmPasswordParam?: string): 'match' | 'mismatch' | 'empty' => {
    const confirmPwd = confirmPasswordParam || confirmPassword;
    if (!password || !confirmPwd) return 'empty';

    return password === confirmPwd ? 'match' : 'mismatch';
  };

  return {
    showPassword,
    showConfirmPassword,
    confirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setConfirmPassword,
    hasCyrillic,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    getPasswordMatchStatus,
  };
}
