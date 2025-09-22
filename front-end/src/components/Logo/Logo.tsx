'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import config from '@/config/config';

export default function Logo({ className = 'logo' }) {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

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

    if (!logoUrl) return null;

    return (
        <div className={className} style={{ position: 'relative', width: 160, height: 60 }}>
            <Image
                src={`${config.PUBLIC_URL}${logoUrl}`}
                alt="Logo"
                width={66}
                height={66}
                className="object-contain"
                priority
                sizes="160px"
            />
        </div>
    );
}
