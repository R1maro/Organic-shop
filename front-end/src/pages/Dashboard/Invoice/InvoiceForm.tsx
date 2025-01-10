import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import Loader from '../../../common/Loader';
import {invoiceService, InvoiceInput} from '../../../services/invoiceService';
import {orderService, Order} from '../../../services/orderService';


const InvoiceForm: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id?: string }>();
    const [loading, setLoading] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [formData, setFormData] = useState<InvoiceInput>({
        order_id: 0,
        payment_method: '',
        due_date: '',
        notes: '',
    });

    useEffect(() => {
        fetchOrders();
        if (id) {
            fetchInvoice(Number(id));
        }
    }, [id]);

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            let page = 1;
            let allOrders: Order[] = [];
            let hasMore = true;

            while (hasMore) {
                const response = await orderService.getAll(page);
                allOrders = [...allOrders, ...response.data];
                hasMore = page < response.last_page;
                page++;
            }

            setOrders(allOrders);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchInvoice = async (invoiceId: number) => {
        try {
            setLoading(true);
            const invoice = await invoiceService.getById(invoiceId);
            setFormData({
                order_id: invoice.order_id,
                payment_method: invoice.payment_method,
                due_date: invoice.due_date || '',
                notes: invoice.notes || '',
            });
        } catch (error) {
            toast.error('Failed to fetch invoice details');
            navigate('/invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await invoiceService.update(Number(id), formData);
                toast.success('Invoice updated successfully');
            } else {
                await invoiceService.create(formData);
                toast.success('Invoice created successfully');
            }
            navigate('/invoices');
        } catch (error) {
            toast.error('Failed to save invoice');
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'order_id' ? Number(value) : value,
        }));
    };

    if (loading) return <Loader/>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Invoice' : 'Create Invoice'}</h1>
            <form onSubmit={handleSubmit}>
                {/* Order Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Order</label>
                    <select
                        name="order_id"
                        value={formData.order_id}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loadingOrders} // Disable select when orders are loading
                    >
                        <option value="">
                            {loadingOrders ? 'Loading orders...' : 'Select an Order'}
                        </option>
                        {orders.map((order) => (
                            <option key={order.id} value={order.id}>
                                Order #{order.order_number} - {order.user.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Due Date */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date || ''}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Select Payment Method</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                </div>

                {/* Notes */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        placeholder="Additional notes..."
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {id ? 'Update Invoice' : 'Create Invoice'}
                </button>
            </form>
        </div>
    );
};

export default InvoiceForm;
