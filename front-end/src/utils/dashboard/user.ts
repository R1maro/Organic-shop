import {apiClient} from "@/lib/apiClient";
import {UsersResponse , Role , User } from "@/types/user";


export async function getUsers(page: number = 1, search: string = '') {
    let endpoint = `/admin/users?page=${page}`;
    if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
    }

    return await apiClient(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }) as Promise<UsersResponse>;
}


export const fetchRoles = async (): Promise<Role[]> => {
    const response = await apiClient('/admin/roles', {
        cache: 'no-store'
    });
    return response.data || response;
};

export type CreateUserData = {
    name: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    phone: FormDataEntryValue | null;
    address: FormDataEntryValue | null;
    is_admin: number;
    roles: FormDataEntryValue | null;
};

export const createUser = async (data: CreateUserData) => {
    return await apiClient('/admin/users', {
        method: 'POST',
        body: data,
        contentType: 'application/json'
    });
};

export const getUser = async (id: string): Promise<User> => {
    const response = await apiClient(`/admin/users/${id}`, {
        cache: 'no-store'
    });
    return response.data || response;
};

export interface UpdateUserData {
    name: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    phone: FormDataEntryValue | null;
    address: FormDataEntryValue | null;
    is_admin: number;
    roles: number | null;
    password?: FormDataEntryValue;
}

export const updateUser = async (id: string, data: UpdateUserData) => {


    const form = new FormData();
    form.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            form.append(key, value.toString());
        }
    });

    return await apiClient(`/admin/users/${id}`, {
        method: 'POST',
        body: form,
    });
};