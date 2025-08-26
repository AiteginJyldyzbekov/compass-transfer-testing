"use client"
import { useEffect, useState } from "react";
import { useDriverProfile } from "../model/hooks/useDriverProfile";
import { useRouter } from "next/navigation";

interface FormData {
    fullName: string;
    phoneNumber: string;
}

interface ProfileFormProps {
    onSave?: (data: FormData) => void;
    onCancel?: () => void;
}

export function ProfileForm({ onSave, onCancel }: ProfileFormProps) {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        phoneNumber: "",
    });
    const router = useRouter();
    const { actions } = useDriverProfile();

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (): void => {
        actions.updateDriverSelf({
            phoneNumber: formData.phoneNumber,
            fullName: formData.fullName
        }).then(() => {
            router.push("/settings")
        })
    };

    const handleCancel = (): void => {
        router.push("/settings")
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
            <div className="h-32"></div>
        </div>
    );
}