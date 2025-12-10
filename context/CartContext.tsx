'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import AuthModal from '@/components/AuthModal';

interface CartItem {
    bookId: string;
    quantity: number;
    title?: string;
    price?: number;
    image?: string;
    author?: string;
}

interface CartContextType {
    cart: CartItem[];
    cartCount: number;
    addToCart: (bookId: string | number) => Promise<{ success: boolean; message: string }>;
    updateQuantity: (bookId: string | number, quantity: number) => Promise<void>;
    removeFromCart: (bookId: string | number) => Promise<void>;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Fetch cart when user logs in
    useEffect(() => {
        if (status === 'authenticated') {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [status]);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            if (!res.ok) {
                console.error("Failed to fetch cart:", res.status, res.statusText);
                return;
            }

            // Check if there is content to parse
            const text = await res.text();
            if (!text) {
                setCart([]);
                return;
            }

            const data = JSON.parse(text);
            if (data.cart) setCart(data.cart);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    };

    const addToCart = async (bookId: string | number) => {
        console.log("[CartContext] addToCart called with:", bookId, "Session status:", status);
        if (status !== 'authenticated') {
            console.log("[CartContext] User not authenticated, opening modal");
            setIsAuthModalOpen(true);
            return { success: false, message: 'User not authenticated' };
        }

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, action: 'add' }),
            });

            const text = await res.text();
            let data: any = {};

            try {
                if (text) data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse cart response:", text);
                return { success: false, message: "Invalid server response" };
            }

            if (res.ok) {
                setCart(data.cart || []);
                return { success: true, message: 'Added to cart' };
            } else {
                console.error("Cart API Error:", data);
                return { success: false, message: data.message || 'Failed to add' };
            }
        } catch (error) {
            console.error("Failed to add to cart", error);
            return { success: false, message: 'Network error' };
        }
    };

    const updateQuantity = async (bookId: string | number, quantity: number) => {
        if (status !== 'authenticated') return;

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, quantity, action: 'update' }),
            });
            const data = await res.json();
            if (res.ok) setCart(data.cart);
        } catch (error) {
            console.error("Failed to update cart", error);
        }
    };

    const removeFromCart = async (bookId: string | number) => {
        if (status !== 'authenticated') return;

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, action: 'remove' }),
            });
            const data = await res.json();
            if (res.ok) setCart(data.cart);
        } catch (error) {
            console.error("Failed to remove from cart", error);
        }
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            addToCart,
            updateQuantity,
            removeFromCart,
            isAuthModalOpen,
            openAuthModal: () => setIsAuthModalOpen(true),
            closeAuthModal: () => setIsAuthModalOpen(false)
        }}>
            {children}
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
