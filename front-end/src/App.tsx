import {useEffect, useState} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import {useAuth} from './AuthContext';
import CategoryList from './pages/Dashboard/Category/CategoryList.tsx';
import CategoryForm from './pages/Dashboard/Category/CategoryForm.tsx';
import Index from "./pages/Website/Index";
import ProductList from "./pages/Dashboard/Product/ProductList.tsx";
import ProductForm from "./pages/Dashboard/Product/ProductForm.tsx";
import OrderList from "./pages/Dashboard/Order/OrderList.tsx";
import OrderForm from "./pages/Dashboard/Order/OrderForm.tsx";
import InvoiceList from "./pages/Dashboard/Invoice/InvoiceList.tsx";
import InvoiceForm from "./pages/Dashboard/Invoice/InvoiceForm.tsx";
import SettingList from "./pages/Dashboard/Setting/SettingList.tsx";
import SettingForm from "./pages/Dashboard/Setting/SettingForm.tsx";

function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const { pathname } = useLocation();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <Routes>
            {/* Public Routes */}
            {!isAuthenticated ? (
                <>
                    <Route
                        path="/"
                        element={
                            <>
                                <PageTitle title="Welcome | Organic-Shop" />
                                <Index />
                            </>
                        }
                    />
                    <Route
                        path="/auth/signin"
                        element={
                            <>
                                <PageTitle title="Signin | TailAdmin" />
                                <SignIn />
                            </>
                        }
                    />
                    <Route
                        path="/auth/signup"
                        element={
                            <>
                                <PageTitle title="Signup | TailAdmin" />
                                <SignUp />
                            </>
                        }
                    />
                    {/*<Route path="*" element={<Navigate to="/" />} />*/}
                </>
            ) : (
                <>
                    {/* Authenticated Index Route */}
                    <Route
                        path="/"
                        element={
                            <>
                                <PageTitle title="Welcome | Organic-Shop" />
                                <Index />
                            </>
                        }
                    />
                    {/* Authenticated Protected Routes */}
                    <Route
                        path="*"
                        element={
                            <DefaultLayout>
                                <Routes>
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <>
                                                <PageTitle title="Dashboard" />
                                                <ECommerce />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/calendar"
                                        element={
                                            <>
                                                <PageTitle title="Calendar | TailAdmin" />
                                                <Calendar />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/categories"
                                        element={
                                            <>
                                                <PageTitle title="Categories | TailAdmin" />
                                                <CategoryList />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/categories/create"
                                        element={
                                            <>
                                                <PageTitle title="Create Category | TailAdmin" />
                                                <CategoryForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/categories/edit/:id"
                                        element={
                                            <>
                                                <PageTitle title="Edit Category | TailAdmin" />
                                                <CategoryForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/products"
                                        element={
                                            <>
                                                <PageTitle title="Products | TailAdmin" />
                                                <ProductList />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/products/create"
                                        element={
                                            <>
                                                <PageTitle title="Create Product | TailAdmin" />
                                                <ProductForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/products/edit/:id"
                                        element={
                                            <>
                                                <PageTitle title="Edit Product | TailAdmin" />
                                                <ProductForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/orders"
                                        element={
                                            <>
                                                <PageTitle title="Orders | TailAdmin" />
                                                <OrderList />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/orders/create"
                                        element={
                                            <>
                                                <PageTitle title="Create Order | TailAdmin" />
                                                <OrderForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/orders/edit/:id"
                                        element={
                                            <>
                                                <PageTitle title="Edit Order | TailAdmin" />
                                                <OrderForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/invoices"
                                        element={
                                            <>
                                                <PageTitle title="Invoices | TailAdmin" />
                                                <InvoiceList />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/invoices/create"
                                        element={
                                            <>
                                                <PageTitle title="Create Invoices | TailAdmin" />
                                                <InvoiceForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/invoices/edit/:id"
                                        element={
                                            <>
                                                <PageTitle title="Edit Invoices | TailAdmin" />
                                                <InvoiceForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/settings"
                                        element={
                                            <>
                                                <PageTitle title="Settings | TailAdmin" />
                                                <SettingList />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/settings/create"
                                        element={
                                            <>
                                                <PageTitle title="Create Setting | TailAdmin" />
                                                <SettingForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/settings/edit/:id"
                                        element={
                                            <>
                                                <PageTitle title="Edit Setting | TailAdmin" />
                                                <SettingForm />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <>
                                                <PageTitle title="Profile | TailAdmin" />
                                                <Profile />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/forms/form-elements"
                                        element={
                                            <>
                                                <PageTitle title="Form Elements | TailAdmin" />
                                                <FormElements />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/forms/form-layout"
                                        element={
                                            <>
                                                <PageTitle title="Form Layout | TailAdmin" />
                                                <FormLayout />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/tables"
                                        element={
                                            <>
                                                <PageTitle title="Tables | TailAdmin" />
                                                <Tables />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/settings"
                                        element={
                                            <>
                                                <PageTitle title="Settings | TailAdmin" />
                                                <Settings />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/chart"
                                        element={
                                            <>
                                                <PageTitle title="Basic Chart | TailAdmin" />
                                                <Chart />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/ui/alerts"
                                        element={
                                            <>
                                                <PageTitle title="Alerts | TailAdmin" />
                                                <Alerts />
                                            </>
                                        }
                                    />
                                    <Route
                                        path="/ui/buttons"
                                        element={
                                            <>
                                                <PageTitle title="Buttons | TailAdmin" />
                                                <Buttons />
                                            </>
                                        }
                                    />
                                </Routes>
                            </DefaultLayout>
                        }
                    />
                </>
            )}
        </Routes>
    );
}

export default App;
