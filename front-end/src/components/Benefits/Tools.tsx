import { IconDisplay } from '@/components/Settings/IconSelector';
import config from "@/config/config";

interface Benefit {
    id: number;
    key: string;
    label: string;
    value: string;
    type: string;
    description: string | null;
    image_url: string | null;
}

async function getBenefits() {
    try {
        const response = await fetch(`${config.API_URL}/settings/benefits`);

        if (!response.ok) {
            throw new Error('Failed to fetch benefits');
        }

        const data = await response.json();
        return data.data.slice(-4) as Benefit[];
    } catch (error) {
        console.error('Error fetching benefits:', error);
        return [];
    }
}

export default async function BenefitsSectionServer() {
    const benefits = await getBenefits();

    if (benefits.length === 0) {
        return null;
    }

    return (
        <section className="bg-white dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
                    Benefits of Buying From Us
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.id}
                            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
                        >
                            <div className="mb-4 flex justify-center">
                                {benefit.type === 'icon' ? (
                                    <div className="text-primary dark:text-primary-400">
                                        <IconDisplay iconName={benefit.value} size={40}/>
                                    </div>
                                ) : benefit.image_url ? (
                                    <img
                                        src={`${config.PUBLIC_URL}${benefit.image_url}`}
                                        alt={benefit.label}
                                        className="h-16 w-16 object-contain"
                                    />
                                ) : (
                                    <div
                                        className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <span className="text-gray-500 dark:text-gray-400">No image</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {benefit.label}
                            </h3>

                            {benefit.description && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {benefit.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}