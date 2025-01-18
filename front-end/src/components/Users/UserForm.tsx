'use client';

interface User {
    id: number;
    name: string;
    email: string;
    password:string;
    phone: string;
    address: string;
    is_admin: boolean;
}

interface UserFormProps {
    action: (formData: FormData) => Promise<void>;
    initialData?: User;
}

export default function UserForm({ action, initialData }: UserFormProps) {
    console.log(initialData)
    return (
        <form action={action}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={initialData?.name || ''}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={initialData?.email || ''}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        {initialData ? 'Password (leave empty to keep current)' : 'Password'}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required={!initialData}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        defaultValue={initialData?.phone || ''}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        defaultValue={initialData?.address || ''}
                        rows={3}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-md text-black dark:text-white font-medium">Admin Access:</span>
                    <label className="relative inline-block w-14 h-8">
                        <input
                            type="checkbox"
                            id="is_admin"
                            name="is_admin"
                            defaultChecked={initialData?.is_admin || false}
                            className="peer hidden"
                        />
                        <span className="absolute inset-0 bg-gray-300 rounded-full transition duration-300 peer-checked:bg-blue-500"></span>
                        <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-6"></span>
                    </label>
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
                        {initialData ? 'Update User' : 'Create User'}
                    </button>
                </div>
            </div>
        </form>
    );
}