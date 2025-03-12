'use client';
import {useState} from 'react';
import {
    AlertCircle,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Award,
    BaggageClaim,
    BarChart,
    Bell,
    Box,
    Calendar,
    Camera,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Cloud,
    CreditCard,
    DollarSign,
    Download,
    Edit,
    Euro,
    Eye,
    EyeOff,
    File,
    Filter,
    Flag,
    Gift,
    Globe,
    Heart,
    Home,
    Image,
    Info,
    Key,
    LampCeiling,
    Layers,
    Link,
    List,
    ListOrdered,
    Lock,
    LogIn,
    LogOut,
    Mail,
    Map,
    MapPin,
    Quote,
    Menu,
    MessageCircle,
    Minus,
    Package,
    PackageCheck,
    Percent,
    Phone,
    PieChart,
    Play,
    Plus,
    Printer,
    Receipt,
    RefreshCw,
    Save,
    Search,
    Settings,
    Share,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Star,
    Store,
    Sun,
    Tag,
    ThumbsDown,
    ThumbsUp,
    Truck,
    Upload,
    User,
    UserPlus,
    Users,
    Video,
    Wallet,
    Wifi,
    X,
    Zap,
    Watch,
    ClockArrowDown,
    ClockArrowUp,
    ZoomIn,
    Leaf,
    Sprout,
    Barcode,
    BadgePercent,
    ShoppingBasket,
    Shirt,
    Cake,
    Handshake,
    Rocket
} from 'lucide-react';

export const iconMap = {
    AlertCircle,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Award,
    BaggageClaim,
    BadgePercent,
    BarChart,
    Barcode,
    Bell,
    Box,
    Cake,
    Calendar,
    Camera,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Cloud,
    ClockArrowDown,
    ClockArrowUp,
    CreditCard,
    DollarSign,
    Download,
    Edit,
    Euro,
    Eye,
    EyeOff,
    File,
    Filter,
    Flag,
    Gift,
    Globe,
    Handshake,
    Heart,
    Home,
    Image,
    Info,
    Key,
    LampCeiling,
    Layers,
    Leaf,
    Link,
    List,
    ListOrdered,
    Lock,
    LogIn,
    LogOut,
    Mail,
    Map,
    MapPin,
    Menu,
    MessageCircle,
    Minus,
    Package,
    PackageCheck,
    Percent,
    Phone,
    PieChart,
    Play,
    Plus,
    Printer,
    Quote,
    Rocket,
    Receipt,
    RefreshCw,
    Save,
    Search,
    Settings,
    Share,
    Shirt,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    ShoppingBasket,
    Star,
    Store,
    Sun,
    Sprout,
    Tag,
    ThumbsDown,
    ThumbsUp,
    Truck,
    Upload,
    User,
    UserPlus,
    Users,
    Video,
    Wallet,
    Watch,
    Wifi,
    X,
    Zap,
    ZoomIn,
};

export const iconList = Object.keys(iconMap);

interface IconSelectorProps {
    selectedIcon: string;
    onSelectIcon: (iconName: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const IconSelector = ({
                                 selectedIcon,
                                 onSelectIcon,
                                 isOpen,
                                 onClose
                             }: IconSelectorProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    if (!isOpen) return null;

    const filteredIcons = searchQuery
        ? iconList.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
        : iconList;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-230 max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4 ">
                    <h3 className="text-lg font-medium">Select an Icon</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-md"
                />

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-4 max-h-96 overflow-y-auto">
                    {filteredIcons.map((iconName) => {
                        const IconComponent = iconMap[iconName as keyof typeof iconMap];
                        return (
                            <button
                                key={iconName}
                                type="button"
                                onClick={() => onSelectIcon(iconName)}
                                className={`p-3 border rounded-md flex flex-col items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    selectedIcon === iconName ? 'bg-blue-100 border-blue-500 dark:bg-blue-900' : ''
                                }`}
                            >
                                <IconComponent size={24}/>
                                <span className="text-xs truncate w-full text-center">{iconName}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

interface IconDisplayProps {
    iconName: string;
    size?: number;
}

export const IconDisplay = ({iconName, size = 24}: IconDisplayProps) => {
    if (!iconName) return null;

    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    if (!IconComponent) return null;

    return <IconComponent size={size}/>;
};