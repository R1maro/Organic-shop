import Pagination from "@/components/Pagination/Pagination";
import {UserActivityLogsListProps} from "@/types/logs";
import Link from "next/link";

interface ExtendedUserActivityLogsListProps extends UserActivityLogsListProps {
    sortField?: string;
    sortOrder?: string;
    searchParams: Record<string, string | string[] | undefined>;
    pathname: string;
}

const UserActivityLogsList = ({
                                  logs,
                                  sortField = 'created_at',
                                  sortOrder = 'desc',
                                  searchParams,
                                  pathname  }: ExtendedUserActivityLogsListProps) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getSortUrl = (field: string) => {
        const params = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
            if (value !== undefined) {
                if (typeof value === 'string') {
                    params.set(key, value);
                } else if (Array.isArray(value)) {
                    value.forEach(val => params.append(key, val));
                }
            }
        });

        if (field === sortField) {
            params.set('order', sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            params.set('sort', field);
            params.set('order', 'asc');
        }

        return `${pathname}?${params.toString()}`;
    };

    const renderSortIndicator = (field: string) => {
        if (field !== sortField) return null;

        return sortOrder === 'asc'
            ? <span className="inline-block ml-1 mb-4 w-4 h-4 transition delay-150 duration-300" >
                ↑
            </span>
            : <span className="inline-block ml-1 mt-2 w-4 h-4 transition delay-150 duration-300" >
                ↓
            </span>;
    };

    return (
        <div className="transition duration-300 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

            <div className="max-w-full overflow-x-auto ">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <Link href={getSortUrl('description')} className="flex items-center hover:text-primary">
                                Description {renderSortIndicator('description')}
                            </Link>
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <Link href={getSortUrl('user.name')} className="flex items-center hover:text-primary">
                                User {renderSortIndicator('user.name')}
                            </Link>
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <Link href={getSortUrl('user.email')} className="flex items-center hover:text-primary">
                                User Email {renderSortIndicator('user.email')}
                            </Link>
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <Link href={getSortUrl('ip')} className="flex items-center hover:text-primary">
                                IP Address {renderSortIndicator('ip')}
                            </Link>
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <Link href={getSortUrl('created_at')} className="flex items-center hover:text-primary">
                                Timestamp {renderSortIndicator('created_at')}
                            </Link>
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            <Link href={getSortUrl('action')} className="flex items-center hover:text-primary">
                                Action {renderSortIndicator('action')}
                            </Link>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.data.length > 0 ? (
                        logs.data.map((log) => (
                            <tr key={log.id}>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{log.description}</p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{log.user.name}</p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{log.user.email}</p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{log.ip}</p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{formatDate(log.created_at)}</p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <span
                                        className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success">
                                        {log.action}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}
                                className="border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark">
                                <p className="text-black dark:text-white">No logs found</p>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {logs.meta.total > 0 && (
                <Pagination
                    currentPage={logs.meta.current_page}
                    totalItems={logs.meta.total}
                    itemsPerPage={logs.meta.per_page}
                    baseUrl="/dashboard/logs"
                    className="mt-4"
                />
            )}
        </div>
    );
};

export default UserActivityLogsList;