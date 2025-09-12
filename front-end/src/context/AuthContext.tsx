'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{
        id: number;
        slug: string;
        name: string;
    }>;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    checkAuthStatus: () => Promise<boolean>;
    clearError: () => void;
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
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const router = useRouter();

    const checkAuthStatus = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth/check', {
                method: 'GET',
                credentials: 'include', // Important for cookies
                headers: {
                    'Accept': 'application/json',
                },
                cache: 'no-store',
            });

            const data = await response.json();

            if (data.isAuthenticated && data.user) {
                setUser(data.user);
                setIsAuthenticated(true);
                setIsAdmin(data.user.roles?.some((role: any) => role.slug === 'admin') || false);
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
                return false;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setError('Failed to verify authentication status');
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth', {
                method: 'POST',
                credentials: 'include', // Important for cookies
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

            // Set user data from response
            if (data.user) {
                setUser(data.user);
                setIsAuthenticated(true);
                setIsAdmin(data.user.roles?.some((role: any) => role.slug === 'admin') || false);
            }

            // Dispatch login event for other components
            window.dispatchEvent(new Event('user-login'));

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            console.error('Login error:', error);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth', {
                method: 'DELETE',
                credentials: 'include', // Important for cookies
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Logout failed');
            }

            // Clear user state
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);

            // Dispatch logout event for other components
            window.dispatchEvent(new Event('user-logout'));

            // Redirect to home or login page
            router.push('/');

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Logout failed';
            console.error('Logout error:', error);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [router]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Initialize auth state on mount
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // Listen for auth events from other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            // If auth changes in another tab, re-check auth status
            if (e.key === 'auth-sync') {
                checkAuthStatus();
            }
        };

        const handleVisibilityChange = () => {
            // Re-check auth when tab becomes visible
            if (document.visibilityState === 'visible') {
                checkAuthStatus();
            }
        };

        const handleAuthEvent = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('user-login', handleAuthEvent);
        window.addEventListener('user-logout', handleAuthEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('user-login', handleAuthEvent);
            window.removeEventListener('user-logout', handleAuthEvent);
        };
    }, [checkAuthStatus]);

    const value: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        checkAuthStatus,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
