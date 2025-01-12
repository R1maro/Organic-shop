import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../../common/Loader';
import { Setting, settingService } from '../../../services/dashboard/settingService';
import config from "../../../config";

const SettingList = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [groups, setGroups] = useState<string[]>([]);

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
            console.log(response)
            setSettings(response.data);
            setTotalPages(response.last_page);
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

    if (loading && currentPage === 1) return <Loader />;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName="Settings" />

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search settings..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />

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

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between py-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SettingList;