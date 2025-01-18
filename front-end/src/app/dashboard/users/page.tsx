import UserList from '@/components/Users/UserList';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from 'next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: 'Users | TailAdmin Next.js',
    description: 'User management page',
};


export default function UsersPage({searchParams,}: {
    searchParams: { page?: string; search?: string };
}) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const search = searchParams.search || '';

    return (
        <DefaultLayout>
            <div className="min-h-screen mx-auto px-4 py-8">
                <div className="ms-10">
                    <Breadcrumb pageName="Users"/>
                </div>

                <UserList page={page} initialSearch={search}/>

            </div>
        </DefaultLayout>
    );
}