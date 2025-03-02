'use client';
import {useState, useEffect} from 'react';
import config from "@/config/config";

interface SettingFormProps {
    types: string[];
    groups: string[];
    initialData?: {
        key: string;
        label: string;
        value: string;
        type: string;
        group: string;
        description?: string;
        image_url?: string;
        is_public?: boolean;
    };
    action: (formData: FormData) => Promise<void>;
}

export default function SettingForm({
                                        types,
                                        groups,
                                        action,
                                        initialData
                                    }: SettingFormProps) {
    const [selectedType, setSelectedType] = useState<string>(
        initialData?.type || ''
    );
    const [previewImage, setPreviewImage] = useState<string | null>(
        initialData?.type === 'image' && initialData?.value
            ? `${config.PUBLIC_URL}${initialData.value}`
            : null
    );
    const [isPublic, setIsPublic] = useState<boolean>(initialData?.is_public ?? false);

    useEffect(() => {
        if (initialData?.type) {
            setSelectedType(initialData.type);
        }
        if (initialData?.is_public !== undefined) {
            setIsPublic(initialData.is_public);
        }
    }, [initialData?.type, initialData?.is_public]);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(
                initialData?.type === 'image' && initialData?.value
                    ? `${config.PUBLIC_URL}${initialData.value}`
                    : null
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // If type is image and there's a file selected, don't include the value field
        if (selectedType === 'image') {
            const imageFile = formData.get('image') as File;
            if (!imageFile || imageFile.size === 0) {
                // If no new image is selected, keep the existing value
                formData.set('value', initialData?.value || '');
            } else {
                // If new image is selected, remove the value field as it will be handled by the backend
                formData.delete('value');
            }
        }

        formData.set('is_public', isPublic ? 'true' : 'false');

        try {
            await action(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred: ' + (error as Error).message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="key" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Key
                    </label>
                    <input
                        type="text"
                        id="key"
                        name="key"
                        defaultValue={initialData?.key}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="label" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Label
                    </label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        defaultValue={initialData?.label}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={initialData?.description}
                        rows={4}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="">Select type</option>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="group" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Group
                        </label>
                        <select
                            id="group"
                            name="group"
                            defaultValue={initialData?.group}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="">Select group</option>
                            {groups.map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedType === 'image' ? (
                    <div>
                        <label htmlFor="image" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                        {previewImage && (
                            <div className="mt-2">
                                <p className="text-sm font-medium mb-2">Image Preview:</p>
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <label htmlFor="value" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Value
                        </label>
                        <input
                            type="text"
                            id="value"
                            name="value"
                            defaultValue={initialData?.value}
                            required={selectedType !== 'image'}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                )}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="is_public"
                           className="ml-2 block text-sm font-medium text-black dark:text-white cursor-pointer">
                        Public Setting
                    </label>
                    <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        (Make this setting accessible to the public API)
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => history.back()}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        {initialData ? 'Update Setting' : 'Create Setting'}
                    </button>
                </div>
            </div>
        </form>
    );
}