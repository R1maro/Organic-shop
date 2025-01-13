import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../../common/Loader';
import {Setting, settingService} from '../../../services/dashboard/settingService';
import config from "../../../config";


interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}


const SettingList = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [groups, setGroups] = useState<string[]>([]);

    const [pagination, setPagination] = useState<Pagination>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
    });

    useEffect(() => {
        fetchGroups();
        fetchSettings();
    }, [currentPage, selectedGroup]);

    const fetchGroups = async () => {
        try {
            const groups = await settingService.getGroups();
            setGroups(groups);
        } catch (error) {
            toast.error('Failed to fetch setting groups');
        }
    };

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await settingService.getAll(currentPage, search, selectedGroup);
            setSettings(response.data);
            setPagination({
                current_page: response.meta.current_page,
                last_page: response.meta.last_page,
                per_page: response.meta.per_page,
                total: response.meta.total,
                from: response.meta.from,
                to: response.meta.to
            });
        } catch (error) {
            console.log(error)
            toast.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this setting?')) {
            try {
                await settingService.delete(id);
                toast.success('Setting deleted successfully');
                fetchSettings();
            } catch (error) {
                toast.error('Failed to delete setting');
            }
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchSettings();
    };

    const renderPagination = () => {
        const pages = [];
        let startPage = Math.max(1, pagination.current_page - 2);
        let endPage = Math.min(pagination.last_page, pagination.current_page + 2);

        if (startPage > 1) {
            pages.push(
                <button
                    key="1"
                    onClick={() => setCurrentPage(1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="dots1" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 rounded-md ${
                        pagination.current_page === i
                            ? 'bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < pagination.last_page) {
            if (endPage < pagination.last_page - 1) {
                pages.push(
                    <span key="dots2" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={pagination.last_page}
                    onClick={() => setCurrentPage(pagination.last_page)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                    {pagination.last_page}
                </button>
            );
        }

        return pages;
    };

    if (loading) return <Loader />;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Settings" />

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-100">

                            <input
                                type="text"
                                placeholder="Search settings..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-primary"
                            >
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                                </svg>

                            </button>
                        </div>

                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        >
                            <option value="">All Groups</option>
                            {groups.map((group) => (
                                <option key={group} value={group}>
                                    {group.charAt(0).toUpperCase() + group.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => navigate('/settings/create')}
                        className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80"
                    >
                        Add Setting
                    </button>
                </div>

                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Key</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Value</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Label</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Type</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Group</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {settings.map((setting) => (
                                <tr key={setting.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.key}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.type === 'image' ? (
                                            <img
                                                src={`${config.PUBLIC_URL}${setting.image_url}`}
                                                alt={setting.key}
                                                className="h-30 w-30 object-contain"
                                            />
                                        ) : (
                                            setting.value
                                        )}
                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.label}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    {setting.type}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {setting.group}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button
                                                onClick={() => navigate(`/settings/edit/${setting.id}`)}
                                                className="hover:text-primary"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(setting.id)}
                                                className="hover:text-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {settings.length > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing{' '}
                                        <span className="font-medium">{pagination.from}</span>{' '}
                                        to{' '}
                                        <span className="font-medium">{pagination.to}</span>{' '}
                                        of{' '}
                                        <span className="font-medium">{pagination.total}</span>{' '}
                                        results
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {renderPagination()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SettingList;