'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    roles: any[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const initialize = async () => {
            await checkAuthStatus();
        };

        initialize();
    }, []);

    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth/check', {
                headers: {
                    'Accept': 'application/json',
                },
                cache: 'no-store',
            });

            const data = await response.json();

            if (data.isAuthenticated) {
                setUser(data.user);
                setIsAuthenticated(true);
                localStorage.setItem('auth_status', 'logged_in');
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('auth_status');
                localStorage.removeItem('token');
                return false;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setError('Failed to verify authentication status');
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            localStorage.setItem('auth_status', 'logged_in');

            setUser(data.user);
            setIsAuthenticated(true);

            window.dispatchEvent(new Event('auth-state-change'));

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            console.error('Login error:', error);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Logout failed');
            }

            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('auth_status');

            window.dispatchEvent(new Event('auth-state-change'));

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Logout failed';
            console.error('Logout error:', error);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};