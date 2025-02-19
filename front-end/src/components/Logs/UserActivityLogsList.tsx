import Pagination from "@/components/Pagination/Pagination";
import {UserActivityLogsListProps} from "@/types/logs";

const UserActivityLogsList = ({ logs }: UserActivityLogsListProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Description</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">User</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">User Email</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">IP Address</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Timestamp</th>
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
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark">
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
                    baseUrl="/dashboard/logs" // Update this to match your routing
                    className="mt-4"
                />
            )}
        </div>
    );
};

export default UserActivityLogsList;