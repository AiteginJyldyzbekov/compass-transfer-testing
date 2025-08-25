import { apiGet } from "./client"

export interface User {
    id: string;
    email: string;
    role: string;
    fullName: string;
    online: boolean;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
}

export const driverProfileApi = {
    getUserSelf: async (): Promise<User> => {
        const result = await apiGet("User/self")
        if (result.error) {
            throw new Error(result.error.message);
        }
        return result.data as User;
    }
}