import type { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT: string = "http://localhost:8000/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set => ({
    loading: false,
    orders: [],
    createCheckOutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
            set({ loading: true });

            const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkoutSession, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const session = response.data.session;
            if (session && session.url) {

                window.location.href = session.url;
            } else {
                console.error('[useOrderStore] No session URL in response');
                alert('Error: No payment URL received from server');
            }
            set({ loading: false });
        } catch (error: any) {
            console.error('[useOrderStore] Checkout session error:', error);
            console.error('[useOrderStore] Error response:', error.response?.data);
            console.error('[useOrderStore] Error status:', error.response?.status);
            alert(`Payment error: ${error.response?.data?.message || error.message || 'Unknown error'}`);
            set({ loading: false });
        }
    },
    getOrderDetails: async () => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_END_POINT}/`);
            set({ loading: false, orders: response.data.orders })
        } catch (error) {
            set({ loading: false });
        }
    }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))