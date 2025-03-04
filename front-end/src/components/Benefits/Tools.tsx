import React from 'react';
import config from "@/config/config";

interface Benefit {
    id: number;
    key: string;
    label: string;
    value: string;
    image_url?: string;
    description?: string;
}

async function getBenefits(): Promise<Benefit[]> {
    // Server-side API call
    const response = await fetch(`${config.API_URL}/settings/benefits`, {
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch benefits');
    }

    const data = await response.json();
    return data.data;
}

// Server Component - notice no hooks
const Tools = async () => {
    // Server-side data fetching
    let benefits: Benefit[] = [];
    let error = null;

    try {
        benefits = await getBenefits();
    } catch (err) {
        error = err instanceof Error ? err.message : 'An error occurred';
        console.error('Error fetching benefits:', error);
    }

    if (error) {
        return <div className="flex justify-center py-8 text-red-500">Error: {error}</div>;
    }

    if (benefits.length === 0) {
        return <div className="flex justify-center py-8">No benefits found</div>;
    }

    return (
        <div>
            <span className="flex justify-center font-bold text-2xl my-4">
                <span className="flex my-4">
                    Benefits of

                    buying from us
                </span>
            </span>

            <div className="tools-container">
                {benefits.map((benefit) => {
                    const styles = {
                        backgroundImage: `url(${config.PUBLIC_URL}${benefit.image_url})`,
                        backgroundSize: 'cover',
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