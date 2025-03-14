
'use client';

import { useState, useEffect } from 'react';
import config from '@/config/config';

export default function Logo({ className = 'logo' }) {
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        async function fetchLogo() {
            try {
                const response = await fetch(`${config.API_URL}/settings/logo/`, { cache: 'no-store' });
                const data = await response.json();
                setLogoUrl(data.logo_url || null);
            } catch (error) {
                console.error('Error fetching logo:', error);
            }
        }

        fetchLogo();
    }, []);

    return (
        <img
            className={className}
            src={logoUrl ? `${config.PUBLIC_URL}${logoUrl}` : ''}
            alt="Logo"
        />
    );
}