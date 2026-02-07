import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";
import Stripe from "stripe";



type CheckoutSessionRequest = {
    cartItems: {
        menuId: string;
        name: string;
        image: string;
        price: number;
        quantity: number
    }[],

    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string
    },
    restaurantId: string
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.id }).populate('user').populate('restaurant').sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {



        const checkoutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');



        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            })
        };

        //line items
        const menuItems = restaurant.menus;


        const lineItems = createLineItems(checkoutSessionRequest, menuItems);


        const totalAmount = lineItems.reduce((acc, item) => {
            const unitAmount = Number(item.price_data.unit_amount || 0);
            const quantity = Number(item.quantity || 0);
            return acc + (unitAmount * quantity);
        }, 0);



        const order: any = new Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending",
            totalAmount: totalAmount,
        });

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item: any) => item.image))
            }
        });




        if (!session.url) {
            return res.status(404).json({ success: false, message: "Error while creating session" });

        }

        await order.save();


        return res.status(200).json({
            session
        });

    } catch (error) {
        console.error('[createCheckoutSession] ERROR:', error);
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const stripeWebhook = async (req: Request, res: Response) => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];
        const secret = process.env.STRIPE_WEBHOOK_SECRET;

        // Construct the event using the raw body
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        event = stripe.webhooks.constructEvent(
            req.body,
            signature!,
            secret!
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        try {
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            // Update the order status and payment status if existing
            if (session.payment_status === "paid") {
                order.status = "confirmed";
                // order.paymentStatus = "paid"; // if you have this field
                await order.save();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    res.status(200).send();
};

export const confirmDevOrder = async (req: Request, res: Response) => {
    try {
        const result = await Order.updateMany({ status: "pending" }, { status: "confirmed" });
        return res.status(200).json({ success: true, message: "Confirmed all pending orders", result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    // 1. create line items 
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() == cartItem.menuId);
        if (!menuItem) throw new Error(`Menu item not found`);

        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100
            },
            quantity: cartItem.quantity,
        }
    })
    // 2. return line items
    return lineItems;
}