import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {CreateUserData, createUser , fetchRoles} from "@/utils/user";
import UserForm from '@/components/Users/UserForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create User | TailAdmin Next.js',
    description: 'Create new user page',
};


async function handleCreateUser(formData: FormData) {
    'use server'


    try {
        const data: CreateUserData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            is_admin: formData.get('is_admin') !== null ? 1 : 0,
            roles: formData.get('role_id'),
        };

        await createUser(data);

        revalidatePath('/dashboard/users');
        redirect('/dashboard/users');
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export default async function CreateUserPage() {
    const roles = await fetchRoles();
    return (
        <DefaultLayout>
            <div
                className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Create New User</h1>
                <UserForm action={handleCreateUser} roles={roles}/>
            </div>
        </DefaultLayout>
    );
}