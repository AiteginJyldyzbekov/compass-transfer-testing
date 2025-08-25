"use client"
import { useEffect, useState } from "react";
import { useDriverProfile } from "../model/hooks/useDriverProfile";
import { User } from "../model/hooks/useDriverProfile";

interface FormData {
    fullName: string;
    phoneNumber: string;
    password: string;
}

interface ProfileFormProps {
    onSave?: (data: FormData) => void;
    onCancel?: () => void;
}

export function ProfileForm({ onSave, onCancel }: ProfileFormProps) {
    const [user, setUser] = useState<User>()
    const [formData, setFormData] = useState<FormData>({
        fullName: user?.fullName || "",
        phoneNumber: user?.phoneNumber || "",
        password: ""
    });
    const { actions, isLoading } = useDriverProfile();

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (): void => {
        console.log("Сохранение данных:", formData);
        onSave?.(formData);
    };

    const handleCancel = (): void => {
        console.log("Отмена изменений");
        onCancel?.();
    };

    useEffect(() => {
        actions.getDriverSelf().then((data) => {
            setUser(data as User)
            setFormData({
                fullName: data?.fullName || "",
                phoneNumber: data?.phoneNumber || "",
                password: ""
            });
            console.log(data)
        })
    }, [])

    return (
        <div className="bg-white min-h-screen">
            {/* Заголовок */}
            <div className="px-4 py-6">
                <h1 className="text-xl font-medium text-gray-900">Настройки</h1>
            </div>

            {/* Форма */}
            <div className="px-4 space-y-6">
                {/* ФИО */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Редактировать данные
                    </label>
                    <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">
                            ФИО
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
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
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Пароль */}
                    <div className="mb-6">
                        <label className="block text-xs text-gray-500 mb-1">
                            Пароль
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопки */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 space-y-3">
                <button
                    onClick={handleSave}
                    className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                    Сохранить
                </button>
                <button
                    onClick={handleCancel}
                    className="w-full bg-gray-100 text-gray-700 py-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    Отменить
                </button>
            </div>

            {/* Отступ снизу для фиксированных кнопок */}
            <div className="h-32"></div>
        </div>
    );
}