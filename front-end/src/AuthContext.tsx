import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8000/api/auth-check", { withCredentials: true })
            .then((response) => {
                setIsAuthenticated(response.data.authenticated);
            })
            .catch((error) => {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
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
