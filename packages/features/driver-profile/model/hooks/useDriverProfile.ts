"use client";
import { driverProfileApi } from "@shared/api/driver-profile";
import { logger } from "@shared/lib";
import { useState } from "react";

export interface User {
    id: string;
    email: string;
    role: string;
    phoneNumber: string | null;
    fullName: string;
    avatarUrl: string | null;
    online: boolean | null;
}

export function useDriverProfile() {
    const [isLoading, setIsLoading] = useState(false)

    const getDriverSelf = async (): Promise<User | undefined> => {
        try {
            setIsLoading(true)
            const response = await driverProfileApi.getUserSelf()
            return response as User
        }
        catch (error) {
            logger.error('❌ useDriverProfile.getDriverSelf ошибка:', error);
            return undefined // явно возвращаем undefined при ошибке
        }
        finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        actions: {
            getDriverSelf
        }
    }
}