import { Routes, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';
import WebApp from './WebApp';
import App from './App';
import Index from './pages/Website/Index';

function MainApp() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Shared Route */}
            <Route
                path="/"
                element={
                    <>
                        <Index />
                    </>
                }
            />
            {/* Conditional Routes */}
            {isAuthenticated ? (
                <Route path="/*" element={<App />} />
            ) : (
                <Route path="/*" element={<WebApp />} />
            )}
        </Routes>
    );
}

export default MainApp;
