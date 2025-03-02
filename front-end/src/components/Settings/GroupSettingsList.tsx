import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import config from "@/config/config";
import {getSettings} from '@/utils/dashboard/setting';

interface GroupSettingsListProps {
    groupName: string;
    page?: number;
    search?: string;
}

export default async function GroupSettingsList({groupName, page = 1, search}: GroupSettingsListProps) {
    const settings = await getSettings(page, groupName, search);

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-semibold text-black dark:text-white">
                        {groupName} Settings
                    </h2>
                    <p className="text-sm text-body dark:text-bodydark">
                        Manage settings for the {groupName} group
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/dashboard/settings"
                        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-gray-200 py-4 px-10 text-center font-medium text-black hover:bg-opacity-90 dark:bg-meta-4 dark:text-white lg:px-8 xl:px-10"
                    >
                        Back to Groups
                    </Link>

                    <Link
                        href={{
                            pathname: "/dashboard/settings/create",
                            query: {group: groupName}
                        }}
                        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Add Setting
                    </Link>
                </div>
            </div>

            {search && (
                <div className="mb-6">
                    <p className="text-body dark:text-bodydark">
                        Search results for: <span className="font-medium">{search}</span>
                        <Link
                            href={`/dashboard/settings/group/${encodeURIComponent(groupName)}`}
                            className="ml-2 text-primary hover:underline"
                        >
                            Clear
                        </Link>
                    </p>
                </div>
            )}

            <div className="mb-4">
                <form action={`/dashboard/settings/group/${encodeURIComponent(groupName)}`} method="GET">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search settings..."
                            name="search"
                            defaultValue={search}
                            className="w-full rounded-md border border-stroke py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                        <button
                            type="submit"
                            className="absolute right-4 top-4"
                        >
                            <svg
                                className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                    fill=""
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                    fill=""
                                />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {settings.data.length > 0 ? (
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Label
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Key
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Type
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Value
                                </th>
                                <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">
                                    Public
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {settings.data.map((setting) => (
                                <tr key={setting.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                                        {setting.label}
                                        {setting.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {setting.description}
                                            </p>
                                        )}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.key}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.type}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.type === 'image' ? (
                                            <img
                                                src={`${config.PUBLIC_URL}${setting.value}`}
                                                alt={setting.label}
                                                className="h-20 w-20 object-cover rounded-md"
                                            />
                                        ) : setting.type === 'boolean' ? (
                                            setting.value === 'true' ? 'Yes' : 'No'
                                        ) : (
                                            setting.value
                                        )}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.is_public ? (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-success bg-opacity-10 text-success">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-danger bg-opacity-10 text-danger">
                                                No
                                            </span>
                                        )}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <Link
                                                href={`/dashboard/settings/edit/${setting.id}`}
                                                className="hover:text-primary"
                                                title="Edit Setting"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                                    />
                                                </svg>
                                            </Link>
                                            <button
                                                className="hover:text-danger"
                                                title="Delete Setting"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                        <p className="text-body dark:text-bodydark mb-4">No settings found for this
                            group{search ? ` matching "${search}"` : ''}.</p>
                        <Link
                            href={{
                                pathname: "/dashboard/settings/create",
                                query: {group: groupName}
                            }}
                            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            Add First Setting
                        </Link>
                    </div>
                )}

                {settings.data.length > 0 && (
                    <Pagination
                        currentPage={settings.meta.current_page}
                        totalItems={settings.meta.total}
                        itemsPerPage={settings.meta.per_page}
                        baseUrl={`/dashboard/settings/group/${encodeURIComponent(groupName)}`}
                        searchParams={{
                            ...(search && {search})
                        }}
                        showItemCount={true}
                        className="sm:flex sm:flex-1 sm:items-center sm:justify-between"
                    />
                )}
            </div>
        </div>
    );
}