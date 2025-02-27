import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import UserForm from '@/components/Users/UserForm';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";
import {fetchRoles, getUser, updateUser, UpdateUserData} from '@/utils/dashboard/user';

export const metadata: Metadata = {
    title: 'Edit User | TailAdmin Next.js',
    description: 'Edit user page',
};


async function handleUpdateUser(id: string, formData: FormData) {
    'use server'

    try {
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

        await updateUser(id, data);

        revalidatePath('/dashboard/users');
        redirect('/dashboard/users');
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export default async function EditUserPage({
                                               params: {id},
                                           }: {
    params: { id: string };
}) {
    const user = await getUser(id);
    const updateUserWithId = handleUpdateUser.bind(null, id);
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