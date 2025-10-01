import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Order, Product } from "../types/product";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loading } from "./Loading";
import { Package, Calendar, IndianRupee, ArrowRight, CheckCircle, X, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

// Define OrderItem type locally since it's not exported
interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export const ProfileOrders: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<{ items: OrderItem[], products: Product[] }>({ items: [], products: [] });
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    fetchOrders();
  }, [user, loading, navigate]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error.message);
        return;
      }

      if (data) setOrders(data);
    } catch (err) {
      console.error("Unexpected error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoadingOrderDetails(true);
      
      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      // Fetch product details for each order item
      if (itemsData && itemsData.length > 0) {
        const productIds = itemsData.map(item => item.product_id);
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .in("product_id", productIds);

        if (productsError) throw productsError;

        setOrderItems({
          items: itemsData,
          products: productsData || []
        });
      } else {
        setOrderItems({ items: [], products: [] });
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleOrderClick = async (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    await fetchOrderDetails(order.id);
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    setOrderItems({ items: [], products: [] });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getProductDetails = (productId: string) => {
    return orderItems.products.find(product => product.product_id === productId);
  };

  const formatOrderId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showOrderModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOrderModal]);

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-l from-pink-400 to-purple-400 text-white py-16 relative overflow-hidden ">
                <div className="absolute inset-0 pointer-events-none ">
              {/* Top-left neon circle */}
              <div className="absolute top-6 left-12 w-6 h-6 bg-yellow-400 rounded-full opacity-80 animate-bounce-slow"></div>
              <div className="absolute top-10 left-20 w-4 h-4 bg-pink-400 rounded-full opacity-70 animate-float"></div>
              <div className="absolute top-20 left-32 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-pulse-slow"></div>
    
              {/* Top-right gradient shapes */}
              <div className="absolute top-14 right-14 w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-[20%] opacity-90 animate-float"></div>
              <div className="absolute top-24 right-24 w-4 h-4 bg-pink-300 rounded-full opacity-80 animate-float-reverse"></div>
    
              {/* Bottom-left triangles */}
              <div className="absolute bottom-16 left-1/3 w-5 h-5 bg-purple-400 rotate-45 clip-triangle opacity-80 animate-float-reverse"></div>
              <div className="absolute bottom-8 left-1/4 w-3 h-3 bg-purple-500 rotate-45 clip-triangle opacity-70 animate-bounce-slow"></div>
    
              {/* Mid-right glowing shapes */}
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-pink-400 rounded-full opacity-70 animate-pulse-slow"></div>
              <div className="absolute top-2/5 right-1/2 w-6 h-2 bg-purple-300 rounded opacity-60 animate-float"></div>
              <div className="absolute top-1/2 right-1/4 w-3 h-8 bg-pink-400 rounded opacity-70 animate-bounce-slow"></div>
    
              {/* Extra floating small objects */}
              <div className="absolute bottom-10 right-1/4 w-3 h-3 bg-pink-500 rounded-full opacity-80 animate-float"></div>
              <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-yellow-300 rounded-full opacity-70 animate-float-reverse"></div>
              <div className="absolute bottom-16 left-1/2 w-2 h-2 bg-purple-300 rounded-full opacity-60 animate-pulse-slow"></div>
            </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shine"></div>
    
              
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
    className="text-5xl md:text-7xl font-bold font-baloo mb-4 text-brown-700 drop-shadow-lg"
  >
    Orders
  </motion.h1>
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="text-xl font-poppins text-brown-500 drop-shadow-md"
  >
    📦 Track your purchases with ease
  </motion.p>
</div>

            </div>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 sm:pt-20 lg:pt-24">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cute-charcoal mb-3 font-baloo flex items-center justify-center sm:justify-start gap-3">
              <Package className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-pink-500" />
              Order History
            </h1>
            <p className="text-cute-charcoal opacity-70 text-sm sm:text-base font-poppins">
              {orders.length === 0 
                ? "No orders yet. Start shopping to see your orders here!" 
                : `You have ${orders.length} order${orders.length !== 1 ? 's' : ''} in total`
              }
            </p>
          </div>
        </div>

        {/* Orders List */}
       {/* Orders List */}
<div className="max-w-4xl mx-auto">
  {orders.length === 0 ? (
    <div className="text-center py-12 sm:py-16 lg:py-20">
      <div className="bg-white/80 rounded-3xl p-8 sm:p-12 max-w-md mx-auto border-2 border-pink-100 shadow-sm">
        <Package className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-cute-charcoal mb-2 font-baloo">
          No Orders Found
        </h3>
        <p className="text-cute-charcoal opacity-70 text-sm sm:text-base mb-6 font-poppins">
          Your order history will appear here once you make your first purchase.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 sm:px-8 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-poppins"
        >
          Start Shopping
        </button>
      </div>
    </div>
  ) : (
    <div 
      className="space-y-4 sm:space-6 max-h-[70vh] overflow-y-auto pr-2"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(249 168 212) rgb(243 232 255)'
      }}
    >
      {/* Custom scrollbar styles for Webkit browsers */}
      <style>
        {`
          .scrollbar-custom::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: rgb(243 232 255);
            border-radius: 10px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, rgb(249 168 212), rgb(192 132 252));
            border-radius: 10px;
            border: 2px solid rgb(243 232 255);
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, rgb(244 114 182), rgb(168 85 247));
          }
        `}
      </style>

      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-pink-100/50 hover:border-pink-200 transition-all duration-300 hover:shadow-lg cursor-pointer group scrollbar-custom"
          onClick={() => handleOrderClick(order)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Order Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-2 rounded-xl">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-cute-charcoal font-baloo truncate">
                  {formatOrderId(order.id)}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-cute-charcoal opacity-70 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm sm:text-base font-poppins">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Order Details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              {/* Amount */}
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-lg sm:text-xl font-bold text-cute-charcoal font-poppins">
                  {order.total_amount.toFixed(2)}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-xs sm:text-sm font-semibold text-green-700 font-poppins">
                    {order.payment_status || 'Paid'}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-cute-charcoal opacity-50 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Simple Divider */}
          <div className="mt-4 pt-4 border-t border-pink-100/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-cute-charcoal opacity-60 font-poppins">
                Click to view order details
              </span>
              <span className="text-xs text-green-600 font-semibold font-poppins">
                Payment Completed ✓
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div 
            className="bg-white rounded-3xl max-w-2xl w-full my-8 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  <h2 className="text-xl font-bold font-baloo">
                    Order Details {selectedOrder && formatOrderId(selectedOrder.id)}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {selectedOrder && new Date(selectedOrder.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-semibold">Total: {selectedOrder?.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingOrderDetails ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    {/* Animated logo/icon */}
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl"
                    >
                      <motion.span
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="text-2xl text-white"
                      >
                        ✨
                      </motion.span>
                    </motion.div>
                    <p className="text-cute-charcoal opacity-70 font-poppins">Loading order details...</p>
                  </div>
                </div>
              ) : orderItems.items.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-cute-charcoal opacity-70 font-poppins">No items found in this order</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.items.map((item) => {
                    const product = getProductDetails(item.product_id);
                    return (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-pink-100">
                        <img
                          src={product?.image_url}
                          alt={product?.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-cute-charcoal truncate font-baloo">
                            {product?.name || 'Product not found'}
                          </h3>
                          <p className="text-sm text-cute-charcoal opacity-70 font-poppins">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-cute-charcoal font-poppins">
                            Rs. {item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-cute-charcoal opacity-70 font-poppins">
                            Total: Rs. {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-cute-charcoal opacity-70 font-poppins">Payment Method</p>
                  <p className="font-semibold text-cute-charcoal font-poppins">
                    {selectedOrder?.payment_method || 'Not specified'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-cute-charcoal opacity-70 font-poppins">Total Amount</p>
                  <p className="text-xl font-bold text-cute-charcoal font-poppins">
                    Rs. {selectedOrder?.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};