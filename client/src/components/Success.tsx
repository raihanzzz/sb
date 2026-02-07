
import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import type { CartItem } from "@/types/cartType";



const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (orders.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );

  const currentOrders = orders.filter((order: any) => order.status !== 'delivered');
  const pastOrders = orders.filter((order: any) => order.status === 'delivered');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-full max-w-4xl p-6 sm:p-10">
        
        {/* Current Orders Section */}
        {currentOrders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
              Current Status <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{currentOrders.length} active</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {currentOrders.map((order: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 bg-[var(--orange)] text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide">
                     {order.status}
                   </div>
                  <div className="mt-4">
                    {order.cartItems.map((item: CartItem) => (
                      <div key={item._id} className="flex items-start gap-4 mb-4 last:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                            {item.name}
                          </h3>
                          <div className="flex justify-between items-center mt-1">
                             <span className="text-sm text-gray-500 font-medium">{item.quantity} x <IndianRupee className="w-3 h-3 inline" />{item.price}</span>
                             <span className="text-gray-800 dark:text-gray-200 font-bold flex items-center">
                                <IndianRupee className="w-4 h-4" />
                                {item.price * item.quantity}
                             </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4 dark:bg-gray-600" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                    <span className="text-[var(--orange)] font-bold text-lg flex items-center">
                      <IndianRupee className="w-4 h-4" />{order.totalAmount / 100}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Orders Section */}
        {pastOrders.length > 0 && (
          <div className={currentOrders.length > 0 ? "mt-12" : ""}>
             <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-[var(--orange)] pl-4">
              Past Orders
            </h2>
            <div className="space-y-4">
              {pastOrders.map((order: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-[var(--orange)] transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex-1">
                        <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                          Order Completed
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                          {order.cartItems.map((item: CartItem, i:number) => (
                            <span key={item._id}>
                              {item.name} (x{item.quantity}){i < order.cartItems.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                     </div>
                     <div className="flex items-end sm:items-center justify-between sm:gap-6 min-w-[120px]">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                          DELIVERED
                        </span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                           <IndianRupee className="w-4 h-4" />{order.totalAmount / 100}
                        </span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
            <Link to="/cart">
            <Button className="bg-[var(--orange)] hover:bg-[var(--hoverOrange)] w-full py-6 rounded-xl shadow-md text-lg font-semibold tracking-wide transition-all transform hover:scale-[1.01]">
                Continue Shopping
            </Button>
            </Link>
        </div>
      </div>
    </div>
  );
};
export default Success;
