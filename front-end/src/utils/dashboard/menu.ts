import config from '@/config/config';

export interface MenuItem {
    id: number;
    name: string;
    url: string;
    order?: number;
    icon?:string;
    parent_id: number | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export async function getMenuItems(): Promise<MenuItem[]> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

export async function getMenuItem(id: number): Promise<MenuItem | null> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error(`Error fetching menu item ${id}:`, error);
        return null;
    }
}

export async function getTrashedMenuItems(): Promise<MenuItem[]> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/trashed`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching trashed menu items:', error);
        return [];
    }
}

export async function createMenuItem(menuItem: Partial<MenuItem>): Promise<{success: boolean; data?: MenuItem; error?: string}> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menuItem),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create menu item');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

export async function updateMenuItem(id: number, menuItem: Partial<MenuItem>): Promise<{success: boolean; data?: MenuItem; error?: string}> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menuItem),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update menu item');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

export async function deleteMenuItem(id: number, childrenStrategy: 'delete' | 'orphan' | 'promote' = 'delete'): Promise<{success: boolean; error?: string}> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/${id}?children_strategy=${childrenStrategy}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete menu item');
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

export async function toggleMenuItemActive(id: number): Promise<{success: boolean; isActive?: boolean; error?: string}> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/${id}/toggle-active`, {
            method: 'PATCH',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to toggle menu item status');
        }

        return {
            success: true,
            isActive: data.data.is_active
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

export async function reorderMenuItems(items: {id: number; order: number}[]): Promise<{success: boolean; error?: string}> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/reorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to reorder menu items');
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

export async function restoreMenuItem(id: number): Promise<{success: boolean; data?: MenuItem; error?: string}> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/${id}/restore`, {
            method: 'PATCH',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to restore menu item');
        }

        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

export async function forceDeleteMenuItem(id: number): Promise<{success: boolean; error?: string}> {
    try {
        const response = await fetch(`${config.API_URL}/admin/menu-items/${id}/force`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to permanently delete menu item');
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}