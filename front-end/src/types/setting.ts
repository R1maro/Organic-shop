interface Setting {
    id: number;
    key: string;
    label: string;
    value: string;
    type: string;
    group: string;
    description?: string;
    is_public?: boolean;
}
export interface SettingFormData {
    key: string;
    label: string;
    value: string;
    type: string;
    group: string;
    description?: string;
    image_url?: string;
}
export interface SettingCreateUpdateData {
    key: string;
    label: string;
    value: string;
    type: string;
    group: string;
    description?: string;
    is_public?: boolean;
    image?: File;
}
export interface SettingResponse {
    data: Setting;
}

export interface SettingsResponse {
    data: Setting[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };

}