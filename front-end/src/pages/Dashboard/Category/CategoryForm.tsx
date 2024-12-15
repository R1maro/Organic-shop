import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import {categoryService} from '../../../services/categoryService';
import Loader from '../../../common/Loader';

interface Category {
    id: number;
    name: string;
}

const CategoryForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<{
        name: string;
        description: string | null;
        parent_id: number | null;
        is_active: boolean;
    }>({
        name: '',
        description: null,
        parent_id: null,
        is_active: true,
    });

    useEffect(() => {
        fetchCategories(); // Fetch all categories for parent dropdown
        if (id) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAll();
            // @ts-ignore
            setCategories(response.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getById(Number(id));
            setFormData({
                name: response.name,
                description: response.description || '',
                parent_id: response.parent_id,
                is_active: response.is_active,
            });
        } catch (error) {
            toast.error('Failed to fetch category');
            navigate('/categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await categoryService.update(Number(id), formData);
                toast.success('Category updated successfully');
            } else {
                await categoryService.create(formData);
                toast.success('Category created successfully');
            }
            navigate('/categories');
        } catch (error) {
            toast.error(id ? 'Failed to update category' : 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) return <Loader/>;

    // @ts-ignore
    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName={id ? 'Edit Category' : 'Create Category'}/>

                <div
                    className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {id ? 'Edit Category' : 'Create New Category'}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Name <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter category name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description === null ? '' : formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter category description"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Parent Category
                                </label>
                                <select
                                    name="parent_id"
                                    value={formData.parent_id || ''}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="">None</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="flex cursor-pointer select-none items-center">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            className="sr-only"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                        />
                                        <div className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                                            formData.is_active
                                                ? 'border-primary bg-primary'
                                                : 'border-stroke dark:border-strokedark'
                                        }`}>
                      <span className={`opacity-0 ${formData.is_active && '!opacity-100'}`}>
                        <svg
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill="#fff"
                              stroke="#fff"
                              strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                                        </div>
                                    </div>
                                    Active
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                {loading ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CategoryForm;