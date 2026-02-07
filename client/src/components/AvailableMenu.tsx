import type { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";

const AvailableMenu = ({ menus, restaurantId }: { menus: MenuItem[], restaurantId: string }) => {
  const { cart, addToCart } = useCartStore();
  const navigate = useNavigate();
  return (
    <div className="md:p-4">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6">
        Available Menus
      </h1>
      <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
        {menus.map((menu: MenuItem) => (
          <Card className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
            <img src={menu.image} alt="" className="w-full h-40 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{menu.description}</p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]">₹{menu.price}</span>
              </h3>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                onClick={() => {
                   // Check if cart has items from another restaurant
                   const isDifferentRestaurant = cart.length > 0 && cart[0].quantity > 0 && useCartStore.getState().restaurantId !== restaurantId;
                   
                   if (isDifferentRestaurant) {
                       const confirm = window.confirm(
                           "You have items from another restaurant in your cart. Adding this item will clear your existing cart. Do you want to proceed?"
                       );
                       if (!confirm) return;
                   }
                   
                  addToCart(menu, restaurantId);
                  navigate("/cart");
                }}
                className=" w-full bg-[var(--orange)] hover:bg-[var(hoverOrange)]"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default AvailableMenu;
