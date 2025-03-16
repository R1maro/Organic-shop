import { getMenuItems } from "@/utils/dashboard/menu";
import MenuItemGrid from "@/components/Navbar/MenuItemGrid";
import MenuActionBar from "@/components/Navbar/MenuActionBar";

interface MenuItem {
    id: number;
    name: string;
    url: string;
    icon?:string;
    order?: number;
    parent_id: number | null;
    is_active: boolean;
}

interface MenuItemsViewProps {
    search?: string;
}

export default async function MenuItemsView({ search }: MenuItemsViewProps) {
    const menuItems = await getMenuItems();

    const groupedMenuItems = menuItems.reduce((groups: Record<string, MenuItem[]>, item) => {
        const groupKey = item.parent_id === null ? 'Main Menu' :
            menuItems.find(parent => parent.id === item.parent_id)?.name || 'Other';

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {});

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <MenuActionBar initialSearch={search} />

            {Object.keys(groupedMenuItems).length > 0 ? (
                <>
                    {Object.entries(groupedMenuItems).map(([group, items]) => (
                        <div key={group} className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">{group}</h2>
                            <MenuItemGrid items={items} allItems={menuItems} />
                        </div>
                    ))}
                </>
            ) : (
                <div className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No menu items found. Create your first menu item.
                    </p>
                </div>
            )}
        </div>
    );
}