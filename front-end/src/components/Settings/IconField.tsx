'use client';
import { useState } from 'react';
import { IconSelector, IconDisplay } from '@/components/Settings/IconSelector';

interface IconFieldProps {
    selectedIcon: string;
    onChange: (iconName: string) => void;
    label?: string;
}

export const IconField = ({
                              selectedIcon,
                              onChange,
                              label = 'Icon'
                          }: IconFieldProps) => {
    const [showIconSelector, setShowIconSelector] = useState<boolean>(false);

    const handleIconSelect = (iconName: string) => {
        onChange(iconName);
        setShowIconSelector(false);
    };

    return (
        <div>
            <label className="my-3 block text-md font-bold text-black dark:text-white">
                {label}
            </label>
            <div className="my-4">
                <button
                    type="button"
                    onClick={() => setShowIconSelector(true)}
                    className="px-4 py-2 border border-gray-400 font-medium rounded-md flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {selectedIcon ? (
                        <>
                            <IconDisplay iconName={selectedIcon} />
                            <span>{selectedIcon}</span>
                        </>
                    ) : (
                        "Select an icon"
                    )}
                </button>
            </div>

            <IconSelector
                selectedIcon={selectedIcon}
                onSelectIcon={handleIconSelect}
                isOpen={showIconSelector}
                onClose={() => setShowIconSelector(false)}
            />
        </div>
    );
};

export default IconField;