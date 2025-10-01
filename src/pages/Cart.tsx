import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CartItem } from '../types/product';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/shared/Toast';
import { Loading } from './Loading';
import { User, MapPin } from 'lucide-react'; // Add these to your existing imports
import { Profile as ProfileType, Address } from '../types/product'; // Add this




export const Cart: React.FC = () => {
  const { user, loading } = useAuth();   // ✅ use loading state too
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
useEffect(() => {
  if (loading) return;

  if (!user) {
    navigate('/auth');
    return;
  }

  fetchCart();
  fetchUserData(); // Add this line
}, [user, loading]);

// Add this function:
const fetchUserData = async () => {
  try {
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id);

    if (profileData && profileData.length > 0) {
      setProfile(profileData[0]);
    }

    // Fetch addresses
    const { data: addressData } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user!.id);

    if (addressData) {
      setAddresses(addressData);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

  const fetchCart = async () => {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user!.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoadingCart(false);
    }
  };
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', itemId);
      
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await supabase
        .from('cart')
        .delete()
        .eq('id', itemId);
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => 
      total + (item.product?.price || 0) * item.quantity, 0
    );
  };

  const handleRazorpayPayment = async () => {
      if (!profile?.name || !profile?.phone || addresses.length === 0) {
    showToast('Please complete your profile information first', 'warning');
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
    return;
  }

    try {
      const totalAmount = getTotalPrice();
      
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          total_amount: totalAmount,
          status: 'completed',
          payment_method: 'razorpay',
          payment_status: 'paid'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      }));

      await supabase
        .from('order_items')
        .insert(orderItems);

      // Clear cart
      await supabase
        .from('cart')
        .delete()
        .eq('user_id', user!.id);

      // Add notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user!.id,
          title: 'Order Placed Successfully!',
          message: `Your order of Rs. ${totalAmount.toFixed(2)} has been placed successfully.`,
          is_read: false
        });

      setCartItems([]);
      showToast('Payment successful! Order placed.', 'success');
      
      // Simulate Razorpay payment (in real app, integrate actual Razorpay)
      setTimeout(() => {
        navigate('/profile/orders');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('Payment failed. Please try again.', 'error');
    }
  };


if (loading || loadingCart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pt-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-blue-300 text-white py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
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

          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="text-5xl md:text-7xl font-bold font-baloo mb-4 drop-shadow-lg"
            >
              Shopping Cart
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl font-poppins drop-shadow-md"
            >
              🛍️ Your dreamy selections
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-cute-charcoal mb-4 font-baloo">Your cart is empty</h2>
              <p className="text-cute-charcoal opacity-70 mb-8 font-poppins">Add some dreamy pieces to get started!</p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-r from-pink-500 to-purple-400 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
              >
                🛍️ Start Shopping
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                <motion.div
  key={item.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-pink-100"
>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
    {/* Product Image with Navigation */}
    <motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="cursor-pointer"
  onClick={() => navigate(`/shop/${item.product?.product_id}`)}
>
  <img
    src={item.product?.image_url}
    alt={item.product?.name}
    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
  />
</motion.div>
    
    {/* Product Info */}
    <div className="flex-1 min-w-0">
      <h3 className="text-base sm:text-lg font-semibold text-cute-charcoal font-baloo truncate">
        {item.product?.name}
      </h3>
      <div className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        Rs. {item.product?.price.toFixed(2)}
      </div>
    </div>

    {/* Quantity Controls */}
    <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-3">
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="bg-pink-200 text-cute-charcoal p-2 rounded-full hover:bg-pink-300 transition-all duration-300"
        >
          <Minus className="h-4 w-4" />
        </motion.button>
        
        <span className="text-lg font-semibold text-cute-charcoal min-w-[2rem] text-center">
          {item.quantity}
        </span>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="bg-green-200 text-cute-charcoal p-2 rounded-full hover:bg-green-300 transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Delete Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => removeFromCart(item.id)}
        className="bg-red-200 text-red-600 p-2 rounded-full hover:bg-red-300 transition-all duration-300"
      >
        <Trash2 className="h-4 w-4" />
      </motion.button>
    </div>
  </div>
</motion.div>
                ))}
              </div>

              {/* Order Summary */}
           <div className="lg:col-span-1">
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100 sticky top-8"
  >
    <h2 className="text-2xl font-bold text-cute-charcoal mb-6 font-baloo">Order Summary</h2>
    
    {/* Customer Information */}
    <div className="space-y-4 mb-6">
      <div className="border-b border-pink-100 pb-4">
        <h3 className="font-semibold text-cute-charcoal mb-3 font-baloo flex items-center gap-2">
          <User className="h-4 w-4" />
          Customer Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-cute-charcoal opacity-70 font-poppins">Name:</span>
            <span className="font-medium text-cute-charcoal font-poppins text-right">
              {profile?.name || 'Not provided'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-cute-charcoal opacity-70 font-poppins">Phone:</span>
            <span className="font-medium text-cute-charcoal font-poppins text-right">
              {profile?.phone || 'Not provided'}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-b border-pink-100 pb-4">
        <h3 className="font-semibold text-cute-charcoal mb-3 font-baloo flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Shipping Address
        </h3>
        {addresses.length > 0 ? (
          <div className="text-sm space-y-1">
            <p className="font-medium text-cute-charcoal font-poppins">
              {addresses[0].address_line_1}
            </p>
            {addresses[0].address_line_2 && (
              <p className="text-cute-charcoal opacity-70 font-poppins">
                {addresses[0].address_line_2}
              </p>
            )}
            <p className="text-cute-charcoal opacity-70 font-poppins">
              {addresses[0].city}, {addresses[0].state} - {addresses[0].postal_code}
            </p>
            <p className="text-cute-charcoal opacity-70 font-poppins">
              {addresses[0].country}
            </p>
          </div>
        ) : (
          <p className="text-sm text-cute-charcoal opacity-70 font-poppins italic">
            No address added
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-cute-charcoal font-poppins">Subtotal</span>
          <span className="font-semibold text-cute-charcoal">Rs. {getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cute-charcoal font-poppins">Shipping</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cute-charcoal font-poppins">Tax</span>
          <span className="font-semibold text-cute-charcoal">Rs. 0.00</span>
        </div>
        <div className="border-t border-pink-200 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-cute-charcoal font-baloo">Total</span>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Rs. {getTotalPrice().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Payment Button */}
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleRazorpayPayment}
      disabled={!profile?.name || !profile?.phone || addresses.length === 0}
      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-center space-x-2">
        <CreditCard className="h-5 w-5" />
        <span>
          {!profile?.name || !profile?.phone || addresses.length === 0 
            ? 'Complete Profile to Pay' 
            : 'Pay with Razorpay'
          }
        </span>
      </div>
    </motion.button>

    {/* Validation Message */}
  {(!profile?.name || !profile?.phone || addresses.length === 0) && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm cursor-pointer hover:bg-yellow-100 transition-colors duration-200"
    onClick={() => navigate('/profile')}
  >
    <p className="text-yellow-700 font-poppins text-center">
      Please complete your profile information and add a shipping address to proceed with payment.
    </p>
  </motion.div>
)}
  </motion.div>
</div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};