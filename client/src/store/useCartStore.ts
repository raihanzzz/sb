import type { CartState } from '@/types/cartType';
import type { MenuItem } from '@/types/restaurantType';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";



export const useCartStore = create<CartState>()(persist((set) => ({
    cart: [],
    restaurantId: null,
    addToCart: (item: MenuItem, restaurantId: string) => {
        set((state) => {
            // If adding from a different restaurant, clear the cart first
            if (state.restaurantId && state.restaurantId !== restaurantId) {
                return {
                    cart: [{ ...item, quantity: 1 }],
                    restaurantId: restaurantId
                };
            }

            //already added in cart then inc qty
            const existingItem = state.cart.find((cartItem) => cartItem._id == item._id);
            if (existingItem) {
                return {
                    cart: state.cart.map((cartItem) => cartItem._id == item._id ? {
                        ...
                        cartItem, quantity: cartItem.quantity + 1
                    } : cartItem),
                    restaurantId: restaurantId
                }
            } else {
                //add cart
                return {
                    cart: [...state.cart, { ...item, quantity: 1 }],
                    restaurantId: restaurantId
                }
            }
        })
    },
    clearCart: () => {
        set({ cart: [], restaurantId: null });
    },
    removeFromTheCart: (id: string) => {
        set((state) => ({
            cart: state.cart.filter((item) => item._id != id)
        }))
    },
    incrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id == id ? {
                ...item, quantity: item.quantity +
                    1
            } : item)
        }))
    },
    decrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id == id && item.quantity > 1 ? {
                ...item, quantity: item.quantity -
                    1
            } : item)
        }))
    }
}),
    {
        name: 'cart-name',
        storage: createJSONStorage(() => localStorage)
    }
))