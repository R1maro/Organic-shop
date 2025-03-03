"use client";

import React, { useEffect, useState } from 'react';
import config from "@/config/config";


interface Benefit {
    id: number;
    key: string;
    label: string;
    value: string;
    image_url?: string;
    description?: string;
}

interface BenefitsResponse {
    data: Benefit[];
}

const Tools: React.FC = () => {
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${config.API_URL}/settings/benefits`);

                if (!response.ok) {
                    throw new Error('Failed to fetch benefits');
                }

                const data: BenefitsResponse = await response.json();
                setBenefits(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchBenefits();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-8">Loading benefits...</div>;
    }

    if (error) {
        return <div className="flex justify-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <span className="flex justify-center font-bold text-2xl my-4">
                <span className="flex">
                    Benefits of
                </span>
                <span className="flex">
                    buying from us
                </span>
            </span>

            <div className="tools-container">
                {benefits.map((benefit) => {
                    const styles: React.CSSProperties = {
                        backgroundImage: `url(${config.PUBLIC_URL}${benefit.image_url})`,
                        backgroundSize: 'cover',
                        objectFit: 'cover',

                    };

                    return (
                        <div key={benefit.id} className="tool-card">
                            <div className="tool-card-background background-image" style={styles}/>
                            <div className="tool-card-content">
                                <div className="tool-card-content-header">
                                    <span className="tool-card-label">{benefit.label}</span>
                                    {benefit.description && (
                                        <span className="tool-card-description text-sm mt-1">{benefit.description}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tools;