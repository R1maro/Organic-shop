
export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        name: string;
        price: number;
        final_price: number;
        formatted_price: string;
        formatted_final_price: string;
        slug: string;
        full_image_url: string;
    };
}

export interface Cart {
    id: number;
    items: CartItem[];
}

export interface CartResponse {
    cart: Cart;
    items_count: number;
    total: number;
    formatted_total: string;
}

async function fetchCartApi(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: {
            ...options.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'An error occurred with the request');
    }

    return response.json();
}

export async function getCart(): Promise<CartResponse> {
    return fetchCartApi('/api/cart');
}

export async function addToCart(productId: number, quantity: number = 1): Promise<CartResponse> {
    return fetchCartApi('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
            action: 'add',
            product_id: productId,
            quantity
        }),
    });
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<CartResponse> {
    return fetchCartApi('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
            action: 'update',
            cart_item_id: cartItemId,
            quantity
        }),
    });
}

export async function removeCartItem(cartItemId: number): Promise<CartResponse> {
    return fetchCartApi('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
            action: 'remove',
            cart_item_id: cartItemId
        }),
    });
}

export async function clearCart(): Promise<CartResponse> {
    return fetchCartApi('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ action: 'clear' }),
    });
}