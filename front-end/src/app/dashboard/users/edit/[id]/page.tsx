import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import UserForm from '@/components/Users/UserForm';
import config from "@/config/config";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";
import {Role} from "@/types/user";

export const metadata: Metadata = {
    title: 'Edit User | TailAdmin Next.js',
    description: 'Edit user page',
};

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    is_admin: boolean;
    role_id?: number;
};

async function fetchRoles(): Promise<Role[]> {
    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    const res = await fetch(`${config.API_URL}/admin/roles`, {
        headers: {
            'X-XSRF-TOKEN': csrfToken || '',
            'Accept': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
    });

    const responseData = await res.json();
    return responseData.data || responseData;

}

async function getUser(id: string): Promise<User> {
    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    const res = await fetch(`${config.API_URL}/admin/users/${id}`, {
        headers: {
            'X-XSRF-TOKEN': csrfToken || '',
            'Accept': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch user');
    }

    const response = await res.json();
    return response.data || response;
}

async function updateUser(id: string, formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    try {
        // Define an interface for the data structure
        interface UpdateUserData {
            name: FormDataEntryValue | null;
            email: FormDataEntryValue | null;
            phone: FormDataEntryValue | null;
            address: FormDataEntryValue | null;
            is_admin: number;
            roles: number | null;
            password?: FormDataEntryValue;
        }

        const data: UpdateUserData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            is_admin: formData.get('is_admin') !== null ? 1 : 0,
            roles: formData.get('role_id') ? Number(formData.get('role_id')) : null,
        };


        const password = formData.get('password');
        if (password && password.toString().length > 0) {
            data.password = password;
        }


        const form = new FormData();
        form.append('_method', 'PUT');

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(key, value.toString());
            }
        });

        const response = await fetch(`${config.API_URL}/admin/users/${id}`, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken || '',
                'Accept': 'application/json',
            },
            body: form,
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to update user');
        }

        revalidatePath('/dashboard/users');
        redirect('/dashboard/users');
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export default async function EditUserPage({params: {id},}: {
    params: { id: string };
}) {
    const user = await getUser(id);
    const updateUserWithId = updateUser.bind(null, id);
    const roles = await fetchRoles();

    return (
        <DefaultLayout>
            <div
                className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Edit User</h1>
                <UserForm
                    action={updateUserWithId}
                    initialData={user}
                    roles={roles}
                />
            </div>
        </DefaultLayout>
    );
}