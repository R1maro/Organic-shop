import config from "@/config/config";

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        slug: string;
        final_price: number;
        price: number;
        discount: number;
        display_photo_url: string;
        formatted_final_price: string;
    };
}

export interface Cart {
    id: number;
    user_id: number;
    expires_at: string;
    items: CartItem[];
}

export interface CartResponse {
    message: string;
    cart: Cart | null;
    total: number;
    formatted_total: string;
    items_count: number;
}

export const getCart = async (): Promise<CartResponse> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(`${config.API_URL}/cart`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }

    return await response.json();
};

// Add item to cart
export const addToCart = async (productId: number, quantity: number = 1): Promise<CartResponse> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(`${config.API_URL}/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
    }

    return await response.json();
};

// Update cart item
export const updateCartItem = async (cartItemId: number, quantity: number): Promise<CartResponse> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(`${config.API_URL}/cart/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            cart_item_id: cartItemId,
            quantity: quantity
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update cart item');
    }

    return await response.json();
};

// Remove cart item
export const removeCartItem = async (cartItemId: number): Promise<CartResponse> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(`${config.API_URL}/cart/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to remove cart item');
    }

    return await response.json();
};

// Clear cart
export const clearCart = async (): Promise<CartResponse> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(`${config.API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to clear cart');
    }

    return await response.json();
};