'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, Shield, LogOut, Settings, Package, Heart, CreditCard } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface OrderStats {
    orders_count: number;
    pending_orders: number;
    completed_orders: number;
    total_spent: number;
    formatted_total_spent: string;
}

const AccountPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderStats, setOrderStats] = useState<OrderStats>({
        orders_count: 0,
        pending_orders: 0,
        completed_orders: 0,
        total_spent: 0,
        formatted_total_spent: '$0'
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const [editData, setEditData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const router = useRouter();
    const { user, isAuthenticated, logout: authLogout, loading: authLoading, refreshUser } = useAuth();

    useEffect(() => {
        if (user) {
            setEditData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchOrderStats = async () => {
            if (!isAuthenticated) return;

            setStatsLoading(true);
            try {
                const response = await fetch('/api/user/orders/stats', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrderStats(data);
                } else {
                    console.error('Failed to fetch order stats');
                }
            } catch (error) {
                console.error('Error fetching order stats:', error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchOrderStats();
    }, [isAuthenticated]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/signin');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSave = async () => {
        // Validation
        if (!editData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!editData.email.trim()) {
            toast.error('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            const data = await response.json();

            if (response.ok) {
                setIsEditing(false);
                toast.success('Profile updated successfully!');

                await refreshUser();
            } else {
                throw new Error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to update profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const success = await authLogout();

            if (success) {
                // The AuthContext logout function already handles the redirect
            } else {
                console.error("Logout failed");
                router.push("/auth/signin");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
            router.push("/auth/signin");
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
        setIsEditing(false);
    };

    const stats = [
        {
            label: 'Orders',
            value: statsLoading ? '...' : orderStats.orders_count.toString(),
            icon: Package,
            color: 'from-green-500 to-cyan-500'
        },
        {
            label: 'Wishlist',
            value: '12',
            icon: Heart,
            color: 'from-green-400 to-rose-500'
        },
        {
            label: 'Total Spent',
            value: statsLoading ? '...' : orderStats.formatted_total_spent,
            icon: CreditCard,
            color: 'from-green-500 to-indigo-500'
        },
    ];


    if (authLoading || !isAuthenticated  || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-100 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-white">
                        {loading ? 'Updating your profile...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    const isAdmin = user.roles?.some((role) => role.slug === 'admin') || false;
    const emailVerified = user.emailVerified ?? true;

    return (
        <div className="min-h-screen mt-15 bg-gradient-to-br from-slate-900 via-green-100 to-slate-900">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            My Account
                        </h1>
                        <p className="text-slate-400">Manage your profile and preferences</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all duration-300 border border-red-500/30">
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-9">
                    {stats.map((stat) => (
                        <div key={stat.label} className="relative group">
                            <div
                                className="absolute inset-0 bg-gradient-to-r opacity-75 rounded-xl blur group-hover:blur-sm transition-all duration-300"
                                style={{background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`}}></div>
                            <div
                                className="relative bg-slate-800/50 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">{stat.label}</p>
                                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                                        <stat.icon className="text-white" size={24}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <div
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                        {/* Profile Header */}
                        <div className="relative p-8 bg-gradient-to-r from-purple-600/20 to-cyan-600/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                                        <User className="text-white" size={32}/>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            {emailVerified ? (
                                                <span className="flex items-center gap-1 text-green-400 text-sm">
                                                        <Shield size={12}/>
                                                        Verified Account
                                                    </span>
                                            ) : (
                                                <span className="text-yellow-400 text-sm">Pending Verification</span>
                                            )}
                                            {isAdmin && (
                                                <span
                                                    className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Admin</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-full hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50"
                                    >
                                        <Edit3 size={16}/>
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-slate-400 text-sm">
                                        <User size={16}/>
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <p className="text-white font-medium">{user.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Mail size={16}/>
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                        />
                                    ) : (
                                        <p className="text-white font-medium">{user.email}</p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Phone size={16}/>
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                            placeholder="Enter your phone number"
                                            className="w-full px-4 py-3 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                        />
                                    ) : (
                                        <p className="text-white font-medium">{user.phone || 'Not provided'}</p>
                                    )}
                                </div>

                                {/* Member Since */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Calendar size={16}/>
                                        Member Since
                                    </label>
                                    <p className="text-white font-medium">
                                        {user.created_at  ? new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Unknown'}
                                    </p>
                                </div>
                            </div>

                            {/* Address Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-slate-400 text-sm">
                                    <MapPin size={16}/>
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={editData.address}
                                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{user.address || 'Not provided'}</p>
                                )}
                            </div>

                            {/* Save Button */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save size={16} />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-all duration-300 font-medium border border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                        <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all duration-300 border border-slate-600/30">
                                <Package size={18}/>
                                Order History
                            </button>
                            <button
                                className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all duration-300 border border-slate-600/30">
                                <Heart size={18}/>
                                Wishlist
                            </button>
                            <button
                                className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all duration-300 border border-slate-600/30">
                                <Settings size={18}/>
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Security Status */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                        <h3 className="text-white font-bold text-lg mb-4">Account Security</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Email Verified</span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${user.emailVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {user.emailVerified ? 'Verified' : 'Pending'}
                                    </span>
                            </div>
                            <div className="flex items-center justify-between">
                            <span className="text-slate-400">Two-Factor Auth</span>
                                    <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                                        Disabled
                                    </span>
                                </div>
                                <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 rounded-lg hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-300 border border-green-600/30 text-sm">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;