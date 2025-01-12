import axios from 'axios';
import config from '../../config';

export interface Setting {
    id: number;
    key: string;
    value: string | null;
    type: 'text' | 'textarea' | 'image' | 'boolean' | 'email' | 'url' | 'number';
    group: string;
    label: string;
    description: string | null;
    is_public: boolean;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface SettingInput {
    key: string;
    label: string;
    type: Setting['type'];
    group: string;
    description?: string | null;
    value?: string | null;
    is_public?: boolean;
    image?: File;
}

interface ApiResponse<T> {
    data: T;
}

interface PaginatedResponse<T> {
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const settingService = {
    getAll: async (page: number = 1, search?: string, group?: string): Promise<PaginatedResponse<Setting>> => {
        try {
            const response = await axios.get<PaginatedResponse<Setting>>(`${config.API_URL}/admin/settings`, {
                params: {
                    page,
                    search,
                    group,
                    per_page: 10
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: number): Promise<Setting> => {
        try {
            const response = await axios.get<ApiResponse<Setting>>(`${config.API_URL}/admin/settings/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },


    create: async (data: SettingInput): Promise<Setting> => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'is_public') {
                        formData.append(key, (value as boolean) ? '1' : '0');
                    } else if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            const response = await axios.post<ApiResponse<Setting>>(
                `${config.API_URL}/admin/settings`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: Partial<SettingInput>): Promise<Setting> => {
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'is_public') {
                        formData.append(key, (value as boolean) ? '1' : '0');
                    } else if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            const response = await axios.post<ApiResponse<Setting>>(
                `${config.API_URL}/admin/settings/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${config.API_URL}/admin/settings/${id}`);
        } catch (error) {
            throw error;
        }
    },

    getGroups: async (): Promise<string[]> => {
        try {
            const response = await axios.get<ApiResponse<string[]>>(`${config.API_URL}/admin/settings/groups`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    getTypes: async (): Promise<Setting['type'][]> => {
        try {
            const response = await axios.get<ApiResponse<Setting['type'][]>>(`${config.API_URL}/admin/settings/types`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    bulkUpdate: async (settings: { key: string; value: string | null; image?: File }[]): Promise<void> => {
        try {
            const formData = new FormData();
            settings.forEach((setting, index) => {
                formData.append(`settings[${index}][key]`, setting.key);
                if (setting.value !== null) {
                    formData.append(`settings[${index}][value]`, setting.value);
                }
                if (setting.image) {
                    formData.append(`settings[${index}][image]`, setting.image);
                }
            });

            await axios.post(`${config.API_URL}/admin/settings/bulk-update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            throw error;
        }
    }
};
