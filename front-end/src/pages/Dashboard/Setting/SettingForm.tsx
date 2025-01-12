import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../../common/Loader';
import { Setting, SettingInput, settingService } from '../../../services/dashboard/settingService';
import config from "../../../config";

const SettingForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<string[]>([]);
    const [types, setTypes] = useState<Setting['type'][]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<SettingInput>({
        key: '',
        label: '',
        type: 'text',
        group: 'general',
        description: '',
        value: '',
        is_public: true
    });

    useEffect(() => {
        fetchGroups();
        fetchTypes();
        if (id) {
            fetchSetting();
        }
    }, [id]);

    const fetchGroups = async () => {
        try {
            const groups = await settingService.getGroups();
            setGroups(groups);
        } catch (error) {
            toast.error('Failed to fetch groups');
        }
    };

    const fetchTypes = async () => {
        try {
            const types = await settingService.getTypes();
            setTypes(types);
        } catch (error) {
            toast.error('Failed to fetch types');
        }
    };

    const fetchSetting = async () => {
        try {
            setLoading(true);
            const setting = await settingService.getById(Number(id));
            setFormData({
                key: setting.key,
                label: setting.label,
                type: setting.type,
                group: setting.group,
                description: setting.description,
                value: setting.value,
                is_public: setting.is_public
            });
            if (setting.type === 'image') {
                setImagePreview(`${config.PUBLIC_URL}${setting.image_url}`);
            }
        } catch (error) {
            toast.error('Failed to fetch setting');
            navigate('/settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await settingService.update(Number(id), formData);
                toast.success('Setting updated successfully');
            } else {
                await settingService.create(formData);
                toast.success('Setting created successfully');
            }
            navigate('/settings');
        } catch (error) {
            toast.error(id ? 'Failed to update setting' : 'Failed to create setting');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName={id ? 'Edit Setting' : 'Create Setting'} />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {id ? 'Edit Setting' : 'Create New Setting'}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Key <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="key"
                                    placeholder="Enter key (e.g., site_name)"
                                    value={formData.key}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                    disabled={!!id}
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Label <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="label"
                                    placeholder="Enter label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Type <span className="text-meta-1">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                    disabled={!!id}
                                >
                                    {types.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Group <span className="text-meta-1">*</span>
                                </label>
                                <select
                                    name="group"
                                    value={formData.group}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                >
                                    {groups.map((group) => (
                                        <option key={group} value={group}>
                                            {group.charAt(0).toUpperCase() + group.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Value
                                </label>
                                {formData.type === 'textarea' ? (
                                    <textarea
                                        name="value"
                                        rows={4}
                                        value={formData.value || ''}
                                        onChange={handleChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                ) : formData.type === 'image' ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                        {imagePreview && (
                                            <div className="mt-4">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-40 h-40 object-cover rounded-md"
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <input
                                        type={formData.type === 'number' ? 'number' : 'text'}
                                        name="value"
                                        value={formData.value || ''}
                                        onChange={handleChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                )}
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-6 flex items-center">
                                <label className="flex cursor-pointer select-none items-center">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="is_public"
                                            checked={formData.is_public}
                                            onChange={(e) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    is_public: e.target.checked
                                                }))
                                            }
                                            className="sr-only"
                                        />
                                        <div className={`box mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                                            formData.is_public ? 'border-primary bg-primary' : 'border-stroke dark:border-strokedark'
                                        }`}>
                                            <span className={`opacity-0 ${formData.is_public ? '!opacity-100' : ''}`}>
                                                <svg
                                                    className="fill-white"
                                                    width="10"
                                                    height="7"
                                                    viewBox="0 0 10 7"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51909 0.105322 9.70685 0.292804Z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    Public Setting
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                            >
                                {loading ? 'Saving...' : 'Save Setting'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SettingForm;