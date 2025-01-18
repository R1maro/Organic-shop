import UserList from '@/components/Users/UserList';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from 'next';
import SearchForm from "@/components/Users/SearchForm";
import {getUsers} from "@/utils/api";
import Link from "next/link";
import {Suspense} from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: 'Users | TailAdmin Next.js',
    description: 'User management page',
};


export default async function UsersPage({searchParams,}: {
    searchParams: { search?: string; page?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const search = searchParams.search || '';

    const users = await getUsers(page, search);

    return (
        <DefaultLayout>
            <div className="mx-auto min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Users"/>
                <div className="mb-6 flex flex-col gap-3">
                    <Link
                        href="/dashboard/users/create"
                        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Add User
                    </Link>
                    <Suspense fallback={<div>Loading search...</div>}>
                        <SearchForm initialSearch={search}/>
                    </Suspense>
                </div>

                <Suspense fallback={<div>Loading users...</div>}>
                    <UserList users={users} search={search}/>
                </Suspense>
            </div>
        </DefaultLayout>
    );
}