import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.get("http://localhost:8000/api/auth-check", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
                .then((response) => {
                    setIsAuthenticated(response.data.authenticated);
                })
                .catch((error) => {
                    console.error("Error checking authentication:", error);
                    setIsAuthenticated(false);
                });
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken'); // Clear the token
        setIsAuthenticated(false); // Update state
        axios.post("http://localhost:8000/api/logout", {}, {
            withCredentials: true,
        })
            .catch(error => console.error("Error logging out:", error));
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated , logout }}>
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
