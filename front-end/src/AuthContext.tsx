import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios,{AxiosResponse} from "axios";

interface AuthResponse {
    authenticated: boolean;
}
interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response: AxiosResponse<AuthResponse> = await axios.get(
                    "http://localhost:8000/api/auth-check",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    }
                );

                setIsAuthenticated(response.data.authenticated);
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
                localStorage.removeItem('authToken');
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/logout",
                {},
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
        }
    };

    const authContextValue: AuthContextProps = {
        isAuthenticated,
        setIsAuthenticated,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
