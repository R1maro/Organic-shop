import {cookies} from 'next/headers';
import config from '@/config/config';

interface ApiOptions extends RequestInit {
    requireAuth?: boolean;
}

/**
 * Server-side authenticated fetch helper
 * Automatically includes Bearer token from HTTP-only cookies
 */
export async function apiFetch(
    endpoint: string,
    options: ApiOptions = {}
) {
    const { requireAuth = true, ...fetchOptions } = options;

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (requireAuth && !token) {
        throw new Error('Unauthorized - No token found');
    }

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (fetchOptions.headers) {
        const existingHeaders = new Headers(fetchOptions.headers);
        existingHeaders.forEach((value, key) => {
            headers[key] = value;
        });
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return await fetch(`${config.API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });
}

/**
 * Parse API response and handle errors
 */
export async function parseApiResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
}

/**
 * Combined fetch and parse helper
 */
export async function apiRequest(
    endpoint: string,
    options: ApiOptions = {}
) {
    const response = await apiFetch(endpoint, options);
    return parseApiResponse(response);
}