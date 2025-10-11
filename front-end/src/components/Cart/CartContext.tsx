'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useMemo,
} from 'react';
import { Cart, CartResponse, getCart, addToCart, updateCartItem, removeCartItem, clearCart, checkoutCart } from '@/utils/website/cartApi';
import { toast } from 'react-hot-toast';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    itemsCount: number;
    total: number;
    formattedTotal: string;
    addItem: (productId: number, quantity?: number) => Promise<void>;
    updateItem: (cartItemId: number, quantity: number) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    emptyCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    checkout: () => Promise<any>; // Add this line
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [formattedTotal, setFormattedTotal] = useState<string>('$ 0');

    const handleCartResponse = useCallback((response: CartResponse) => {
        setCart(response.cart);
        setItemsCount(response.items_count);
        setTotal(response.total);
        setFormattedTotal(response.formatted_total);
    }, []);

    const refreshCart = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCart();
            handleCartResponse(response);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart(null);
            setItemsCount(0);
            setTotal(0);
            setFormattedTotal('$ 0');

            if (error instanceof Error && !error.message.includes('authenticated')) {
                toast.error('Failed to load shopping cart');
            }
        } finally {
            setLoading(false);
        }
    }, [handleCartResponse]);

    useEffect(() => {
        refreshCart();

        window.dispatchEvent(new Event('auth-state-change'));
        return () => {
            window.dispatchEvent(new Event('auth-state-change'));
        };
    }, [refreshCart]);

    const addItem = useCallback(async (productId: number, quantity: number = 1) => {
        setLoading(true);
        try {
            const response = await addToCart(productId, quantity);
            handleCartResponse(response);
            toast.success('Product added to cart');
        } catch (error) {
            console.error('Error adding item to cart:', error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to add item to cart');
            }
        } finally {
            setLoading(false);
        }
    }, [handleCartResponse]);

    const updateItem = useCallback(async (cartItemId: number, quantity: number) => {
        setLoading(true);
        try {
            const response = await updateCartItem(cartItemId, quantity);
            handleCartResponse(response);
            toast.success('Cart updated');
        } catch (error) {
            console.error('Error updating cart item:', error);
            toast.error('Failed to update cart');
        } finally {
            setLoading(false);
        }
    }, [handleCartResponse]);

    const removeItem = useCallback(async (cartItemId: number) => {
        setLoading(true);
        try {
            const response = await removeCartItem(cartItemId);
            handleCartResponse(response);
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing cart item:', error);
            toast.error('Failed to remove item from cart');
        } finally {
            setLoading(false);
        }
    }, [handleCartResponse]);

    const emptyCart = useCallback(async () => {
        setLoading(true);
        try {
            const response = await clearCart();
            handleCartResponse(response);
            toast.success('Cart cleared');
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        } finally {
            setLoading(false);
        }
    }, [handleCartResponse]);

    // Add checkout function
    const checkout = useCallback(async () => {
        setLoading(true);
        try {
            const response = await checkoutCart();

            // Clear cart state after successful checkout
            setCart(null);
            setItemsCount(0);
            setTotal(0);
            setFormattedTotal('$ 0');

            toast.success('Order created successfully!');
            return response.order;
        } catch (error) {
            console.error('Error during checkout:', error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to create order');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo<CartContextType>(() => ({
        cart,
        loading,
        itemsCount,
        total,
        formattedTotal,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
        refreshCart,
        checkout, // Add this line
    }), [cart, loading, itemsCount, total, formattedTotal, addItem, updateItem, removeItem, emptyCart, refreshCart, checkout]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};