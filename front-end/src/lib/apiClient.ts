import { cookies } from 'next/headers';
import config from '@/config/config';

type RequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    includeToken?: boolean;
    includeCsrf?: boolean;
    contentType?: string;
    cache?: RequestCache;
};

/**
 * Enhanced fetch client that automatically handles authentication tokens
 */
export const apiClient = async (endpoint: string, options: RequestOptions = {}) => {
    const {
        method = 'GET',
        headers = {},
        body,
        includeToken = true,
        includeCsrf = true,
        contentType,
        cache,
    } = options;

    // Get stored tokens
    const cookieStore = cookies();
    const token = includeToken ? cookieStore.get("token")?.value : null;
    const csrfToken = includeCsrf ? cookieStore.get("XSRF-TOKEN")?.value : null;

    const requestHeaders: Record<string, string> = {
        'Accept': 'application/json',
        ...headers,
    };

    if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    if (csrfToken) {
        requestHeaders['X-XSRF-TOKEN'] = csrfToken;
    }

    if (contentType) {
        requestHeaders['Content-Type'] = contentType;
    } else if (body && !(body instanceof FormData)) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include',
    };

    if (cache) {
        requestOptions.cache = cache;
    }

    if (body) {
        requestOptions.body = body instanceof FormData
            ? body
            : JSON.stringify(body);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${config.API_URL}${endpoint}`;

    const response = await fetch(url, requestOptions);
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || `Request failed with status ${response.status}`);
    }

    return responseData;
};