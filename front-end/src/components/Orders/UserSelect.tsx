'use client';

import { useState, useEffect } from 'react';
import config from "@/config/config";

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export default function UserSelect({ value, onChange }: UserSelectProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${config.API_URL}/admin/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error instanceof Error ? error.message : 'Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <select disabled className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                <option>Loading users...</option>
            </select>
        );
    }

    if (error) {
        return (
            <select disabled className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input text-danger">
                <option>Error: {error}</option>
            </select>
        );
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
        >
            <option value="0">Select a user</option>
            {users.map((user) => (
                <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                </option>
            ))}
        </select>
    );
}