import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;




        const restaurant = await Restaurant.findOne({ user: req.id });
        if (restaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant already exist for this user"
            })

        }
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        }
        let imageUrl: string;
        try {
            imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        } catch (err) {
            console.error("Image upload failed:", err);
            return res.status(502).json({ success: false, message: "Image upload failed" });
        }
        const newRestaurant = await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime: Number(deliveryTime),
            cuisines: JSON.parse(cuisines),
            imageUrl
        })
        const user = await User.findById(req.id);
        if (user) {
            user.admin = true;
            user.restaurant = newRestaurant._id;
            user.restaurantName = newRestaurant.restaurantName;
            await user.save();
        }
        return res.status(201).json({
            success: true,
            message: "Restaurant Added",
            restaurant: newRestaurant
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                restaurant: [],
                message: "Restaurant not found"
            })
        };
        return res.status(200).json({
            success: true,
            restaurant
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        };
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);


        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();

        const user = await User.findById(req.id);
        if (user) {
            user.restaurantName = restaurant.restaurantName;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getRestaurantOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        };
        const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
        return res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            success: true,
            status: order.status,
            message: "Status updated"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);



        const query: any = {};
        const orClauses: any[] = [];

        // basic search based on search text (name, city, country)
        if (searchText) {
            orClauses.push(
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            );
        }

        // filter on the basis of searchQuery (search within name & cuisines)
        if (searchQuery) {
            orClauses.push(
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                // match any array element in cuisines via $elemMatch with regex
                { cuisines: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
            );
        }

        if (orClauses.length > 0) {
            query.$or = orClauses;
        }

        if (selectedCuisines.length > 0) {
            // trim possible whitespace from selected cuisines
            const trimmed = selectedCuisines.map((c) => new RegExp(c.trim(), 'i'));
            query.cuisines = { $in: trimmed };
        }

        // console.log('Search params:', { searchText, searchQuery, selectedCuisines }); // Removed in favor of clearer log above

        // debug: log incoming request query and cookies to inspect differences from dev-search


        // execute search
        const restaurants = await Restaurant.find(query);


        return res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getSingleRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { createdAt: -1 }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        }
        return res.status(200).json({ success: true, restaurant });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

// Dev helper: return all restaurants visible to server (development only)
export const debugAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find({});
        console.log('Debug all restaurants, count:', restaurants.length);
        return res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        console.log('Debug all restaurants error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Dev helper: unauthenticated search for quick testing (development only)
export const devSearch = async (req: Request, res: Response) => {
    try {
        const searchText = (req.query.q as string) || "";
        const searchQuery = (req.query.q as string) || "";
        const selectedCuisines = (req.query.cuisines as string || "").split(",").filter(c => c);



        const query: any = {};
        const orClauses: any[] = [];

        if (searchText) {
            orClauses.push(
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            );
        }

        if (searchQuery) {
            orClauses.push(
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
            );
        }

        if (orClauses.length > 0) query.$or = orClauses;
        if (selectedCuisines.length > 0) query.cuisines = { $in: selectedCuisines.map(c => new RegExp(c.trim(), 'i')) };


        const restaurants = await Restaurant.find(query);

        return res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
        console.error('DevSearch error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}