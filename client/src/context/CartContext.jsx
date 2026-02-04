import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    // Generate or retrieve a consistent user ID for this device
    const userId = localStorage.getItem('userId') || `user_${Math.random().toString(36).substr(2, 9)}`;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!localStorage.getItem('userId')) {
            localStorage.setItem('userId', userId);
        }
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/cart/${userId}`);
            if (res.data && res.data.items) {
                // Normalize items to look like product objects with qty, but handling how DB returns them
                const normalized = res.data.items.map(item => ({
                    ...item, // includes name, price, image, qty
                    _id: item.productId // map productId back to _id for frontend compatibility
                }));
                setCart(normalized);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    const addToCart = async (product) => {
        try {
            // Optimistic update
            setCart((prev) => {
                const existing = prev.find((item) => item._id === product._id);
                if (existing) {
                    return prev.map((item) =>
                        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
                    );
                }
                return [...prev, { ...product, qty: 1 }];
            });

            await axios.post(`${API_URL}/api/cart/${userId}/add`, { product });
            // Optionally re-fetch to ensure sync: fetchCart();
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };

    const removeFromCart = async (id) => {
        try {
            setCart((prev) => prev.filter((item) => item._id !== id));
            await axios.delete(`${API_URL}/api/cart/${userId}/remove/${id}`);
        } catch (err) {
            console.error("Error removing from cart:", err);
        }
    };

    const updateQty = async (id, delta) => {
        try {
            let newQty = 0;
            setCart((prev) =>
                prev.map(item => {
                    if (item._id === id) {
                        newQty = item.qty + delta;
                        if (newQty < 1) return item;
                        return { ...item, qty: newQty };
                    }
                    return item;
                })
            );

            // Find the item to get actual qty (since state update depends on closure)
            // Or better, just send the calculated newQty if simpler, but need to be careful with concurrency.
            // For simplicity, we assume the optimistic update calculation holds.
            // Wait, if newQty < 1, we didn't update state, so we shouldn't update server.
            const currentItem = cart.find(i => i._id === id);
            if (currentItem && currentItem.qty + delta >= 1) {
                await axios.post(`${API_URL}/api/cart/${userId}/update`, {
                    productId: id,
                    qty: currentItem.qty + delta
                });
            }

        } catch (err) {
            console.error("Error updating qty:", err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty }}>
            {children}
        </CartContext.Provider>
    );
};
