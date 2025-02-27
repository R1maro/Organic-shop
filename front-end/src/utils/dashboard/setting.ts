import {SettingCreateUpdateData, SettingsResponse} from "@/types/setting";
import {apiClient} from "@/lib/apiClient";

export async function getSettings(page: number = 1, group?: string, search?: string): Promise<SettingsResponse> {
    let endpoint = `/admin/settings?page=${page}`;

    if (group) {
        endpoint += `&group=${encodeURIComponent(group)}`;
    }

    if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
    }

    return apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getSetting(id: string) {
    return apiClient(`/admin/settings/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
}

export async function getSettingGroups() {
    const response = await apiClient(`/admin/settings/groups`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data as string[];
}

export async function getSettingTypes() {
    const response = await apiClient(`/admin/settings/types`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    return response.data as string[];
}


export async function apiCreateSetting(data: SettingCreateUpdateData) {
    const form = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'image' && value instanceof File) {
                form.append(key, value);
            } else {
                form.append(key, value.toString());
            }
        }
    });


    return apiClient(`/admin/settings`, {
        method: 'POST',
        body: form,
    });
}

export async function apiUpdateSetting(
    id: string,
    data: SettingCreateUpdateData,
) {
    const form = new FormData();
    form.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'image' && value instanceof File) {
                form.append(key, value);
            } else {
                form.append(key, value.toString());
            }
        }
    });

    return apiClient(`/admin/settings/${id}`, {
        method: 'POST',
        body: form,
    });
}

export async function apiDeleteSetting(id: string) {
    return apiClient(`/admin/settings/${id}`, {
        method: 'DELETE',
    });
}
