import { useState, useEffect } from 'react';
import axios from 'axios';
import config from "../../config";


export interface Setting {
    id: number;
    key: string;
    value: string;
    type: 'text' | 'textarea' | 'image' | 'boolean' | 'email' | 'url' | 'number';
    group: string;
    label: string;
    description: string | null;
    is_public: boolean;
    media_url?: string;
}

export const useSettings = () => {
    const [settings, setSettings] = useState<Record<string, Setting>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/settings`);
                const settingsData = response.data.reduce((acc: Record<string, Setting>, setting: Setting) => {
                    acc[setting.key] = setting;
                    return acc;
                }, {});
                setSettings(settingsData);
            } catch (err) {
                setError('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const getValue = (key: string, defaultValue: any = null) => {
        if (!settings[key]) return defaultValue;

        const setting = settings[key];

        switch (setting.type) {
            case 'boolean':
                return setting.value === '1' || setting.value === 'true';
            case 'number':
                return Number(setting.value);
            case 'image':
                return setting.media_url;
            default:
                return setting.value;
        }
    };

    return {
        settings,
        loading,
        error,
        getValue
    };
};