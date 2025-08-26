"use client";
import { driverProfileApi } from "@shared/api/driver-profile";
import { logger } from "@shared/lib";
import { useState } from "react";
import type { User } from "@shared/api/driver-profile";

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

    const updateDriverSelf = async (data: Partial<User>) => {
        try {
            const response = await driverProfileApi.updateUserSelf(data)
            return response

        } catch (error) {
            logger.error('❌ useDriverProfile.getDriverSelf ошибка:', error);
            return undefined
        }
    }

    return {
        isLoading,
        actions: {
            getDriverSelf,
            updateDriverSelf
        }
    }
}