import React from 'react';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
    return (
        <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl rounded-lg border border-slate-700/50 p-1">
            <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === 'grid'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                }`}
            >
                <Grid size={18} />
            </button>
            <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                }`}
            >
                <List size={18} />
            </button>
        </div>
    );
};

export default ViewToggle;