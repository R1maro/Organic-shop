import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import {invoiceService} from '../../../services/invoiceService';
import Loader from '../../../common/Loader';

interface Invoice {
    id: number;
    invoice_number: string;
    order_id: number;
    user: {
        name: string;
        email: string;
    };
    subtotal: number;
    tax: number;
    shipping_cost: number;
    total: number;
    status: 'pending' | 'paid' | 'cancelled' | 'refunded';
    payment_method: string;
    due_date: string;
    created_at: string;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const InvoiceList = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [filters, setFilters] = useState({
        status: ''
    });

    useEffect(() => {
        fetchInvoices(1);
    }, [filters]);

    const fetchInvoices = async (page: number) => {
        try {
            setLoading(true);
            const response = await invoiceService.getAll(page, filters.status);
            setInvoices(response.data);
            setPagination({
                current_page: response.current_page,
                last_page: response.last_page,
                per_page: response.per_page,
                total: response.total
            });
        } catch (error) {
            toast.error('Failed to fetch invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await invoiceService.delete(id);
                toast.success('Invoice deleted successfully');
                fetchInvoices(1);
            } catch (error) {
                toast.error('Failed to delete invoice');
            }
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-warning text-warning',
            paid: 'bg-success text-success',
            cancelled: 'bg-danger text-danger',
            refunded: 'bg-info text-info',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-500 text-gray-500';
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchInvoices(i)}
                    className={`px-3 py-1 rounded-md ${
                        pagination.current_page === i
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    if (loading) return <Loader/>;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6 flex flex-col gap-3">
                    <Breadcrumb pageName="Invoices"/>
                    <Link
                        to="/invoices/create"
                        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Create New Invoice
                    </Link>
                    <div className="flex gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                            className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>

                <div
                    className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Invoice Number
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Customer
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Amount
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Due Date
                                </th>
                                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                    Created
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <Link
                                            to={`/invoices/${invoice.id}`}
                                            className="text-primary hover:underline"
                                        >
                                            {invoice.invoice_number}
                                        </Link>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <span className="font-medium">{invoice.user?.name || 'guest'}</span>
                                        <br/>
                                        <span className="text-sm text-gray-500">
                                                {invoice.user?.email || 'user@example.com'}
                                            </span>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        ${invoice.total}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <span
                                                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusColor(
                                                    invoice.status
                                                )}`}
                                            >
                                                {invoice.status.charAt(0).toUpperCase() +
                                                    invoice.status.slice(1)}
                                            </span>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {invoice.due_date ?? '-'}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        {new Date(invoice.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <Link
                                                to={`/invoices/edit/${invoice.id}`}
                                                className="hover:text-primary"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                className="hover:text-danger"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565L13.9504 4.8094C13.9504 4.9219 13.866 5.0344 13.7254 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M10.8661 9.11255C10.5286 9.11255 10.2192 9.3938 10.2192 9.75942V13.3313C10.2192 13.6688 10.5005 13.9782 10.8661 13.9782C11.2036 13.9782 11.513 13.6969 11.513 13.3313V9.75942C11.513 9.3938 11.2036 9.11255 10.8661 9.11255Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M7.13477 9.11255C6.79727 9.11255 6.48789 9.3938 6.48789 9.75942V13.3313C6.48789 13.6688 6.76914 13.9782 7.13477 13.9782C7.47227 13.9782 7.78164 13.6969 7.78164 13.3313V9.75942C7.78164 9.3938 7.47227 9.11255 7.13477 9.11255Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </button>
                                            <Link
                                                to={`/invoices/${invoice.id}/download`}
                                                className="hover:text-primary"
                                                title="Download Invoice"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M6.71 5.29L9 7.59V1h2v6.59l2.29-2.29 1.41 1.41-4.7 4.7-4.7-4.7 1.41-1.41zM18 9h-2v8H4V9H2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9z"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div
                        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => fetchInvoices(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchInvoices(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(pagination.current_page - 1) * pagination.per_page + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(
                                            pagination.current_page * pagination.per_page,
                                            pagination.total
                                        )}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{pagination.total}</span>{' '}
                                    results
                                </p>
                            </div>
                            <div className="flex gap-2">{renderPagination()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoiceList;