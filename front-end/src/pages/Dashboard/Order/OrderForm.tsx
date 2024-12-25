import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../../common/Loader';
import { orderService } from '../../../services/orderService';

interface OrderItem {
    product_id: number;
    quantity: number;
}

interface OrderFormData {
    items: OrderItem[];
    shipping_address: string;
    billing_address: string | null;
    payment_method: string;
    notes: string | null;
}

const OrderForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<OrderFormData>({
        items: [{ product_id: 0, quantity: 1 }],
        shipping_address: '',
        billing_address: null,
        payment_method: '',
        notes: null,
    });

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await orderService.getById(Number(id));
            setFormData({
                items: response.items.map((item: any) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                })),
                shipping_address: response.shipping_address,
                billing_address: response.billing_address,
                payment_method: response.payment_method,
                notes: response.notes,
            });
        } catch (error) {
            toast.error('Failed to fetch order');
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

            if (id) {
                await orderService.update(Number(id), formData);
                toast.success('Order updated successfully');
            } else {
                await orderService.create(formData);
                toast.success('Order created successfully');
            }
            navigate('/orders');
        } catch (error) {
            toast.error(id ? 'Failed to update order' : 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const items = [...formData.items];
        items[index] = { ...items[index], [field]: value };
        setFormData((prev) => ({ ...prev, items }));
    };

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { product_id: 0, quantity: 1 }],
        }));
    };

    const removeItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    if (loading) return <Loader />;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName={id ? 'Edit Order' : 'Create Order'} />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {id ? 'Edit Order' : 'Create New Order'}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            {formData.items.map((item, index) => (
                                <div key={index} className="mb-4.5 flex items-center gap-4">
                                    <select
                                        name="product_id"
                                        value={item.product_id}
                                        onChange={(e) => handleItemChange(index, 'product_id', Number(e.target.value))}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {/* Replace with dynamic product options */}
                                        <option value="1">Product 1</option>
                                        <option value="2">Product 2</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                        placeholder="Quantity"
                                        className="w-1/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItem}
                                className="mb-4 flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                            >
                                Add Item
                            </button>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Shipping Address <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="shipping_address"
                                    value={formData.shipping_address}
                                    onChange={handleChange}
                                    placeholder="Enter shipping address"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Billing Address
                                </label>
                                <input
                                    type="text"
                                    name="billing_address"
                                    value={formData.billing_address || ''}
                                    onChange={handleChange}
                                    placeholder="Enter billing address"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Payment Method <span className="text-meta-1">*</span>
                                </label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter additional notes"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                            >
                                {loading ? 'Saving...' : 'Save Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default OrderForm;
