import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {cookies} from 'next/headers';
import UserForm from '@/components/Users/UserForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import config from "@/config/config";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create User | TailAdmin Next.js',
    description: 'Create new user page',
};

async function createUser(formData: FormData) {
    'use server'

    const cookieStore = cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;

    try {
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            is_admin: formData.get('is_admin') !== null ? 1 : 0,
        };

        const response = await fetch(`${config.API_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken || '',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to create user');
        }

        revalidatePath('/dashboard/users');
        redirect('/dashboard/users');
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export default async function CreateUserPage() {
    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Create New User</h1>
                <UserForm action={createUser} />
            </div>
        </DefaultLayout>
    );
}