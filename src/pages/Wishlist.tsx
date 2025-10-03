import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {  ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '../lib/supabase';
import { WishlistItem } from '../types/product';
import { Loading } from './Loading';



export const Wishlist: React.FC = () => {
  const { user, loading } = useAuth();   // ✅ use loading state too
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
const [addingToCart, setAddingToCart] = useState<string | null>(null); // track product being added
const [popupMessage, setPopupMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

const showPopup = (text: string, type: 'success' | 'error' = 'success') => {
  setPopupMessage({ text, type });
  setTimeout(() => setPopupMessage(null), 2000); // auto-hide after 2s
};

  useEffect(() => {
        if (loading) return; // ✅ wait until auth state is known
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user!.id);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      await supabase
        .from('wishlist')
        .delete()
        .eq('id', itemId);
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
          showPopup('Removed from wishlist', 'success'); // ✅ show pop-up

    } catch (error) {
      console.error('Error removing from wishlist:', error);
          showPopup('Failed to remove item', 'error'); // ✅ show pop-up

    }
  };

 const addToCart = async (productId: string) => {
  try {
    setAddingToCart(productId);
    const { data: existingItem } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user!.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .from('cart')
        .insert({
          user_id: user!.id,
          product_id: productId,
          quantity: 1,
        });
    }

    showPopup('Product added to cart!', 'success'); // ✅ show pop-up
  } catch (error) {
    console.error('Error adding to cart:', error);
    showPopup('Failed to add product.', 'error'); // ✅ show pop-up
  } finally {
    setAddingToCart(null);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
    >
      {/* Popup Message */}
{popupMessage && (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white font-medium z-50 ${
      popupMessage.type === 'success' ? 'bg-gradient-to-l from-pink-400 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-purple-400'
    }`}
  >
    {popupMessage.text}
  </motion.div>
)}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-300 to-red-400 text-white py-16 relative overflow-hidden">
           <div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-6 left-10 w-6 h-6 bg-pink-400 rounded-full opacity-80 animate-bounce-slow"></div>
  <div className="absolute top-16 right-12 w-5 h-5 bg-purple-400 rounded-full opacity-70 animate-float"></div>
  <div className="absolute top-24 left-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse-slow"></div>
  
  <div className="absolute bottom-12 left-1/3 w-5 h-5 bg-purple-400 rotate-45 clip-triangle opacity-80 animate-float-reverse"></div>
  <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-pink-500 rotate-45 clip-triangle opacity-70 animate-bounce-slow"></div>
  
  <div className="absolute top-1/3 right-1/3 w-6 h-2 bg-pink-400 rounded opacity-70 animate-float"></div>
  <div className="absolute top-2/5 right-1/2 w-3 h-3 bg-yellow-300 rounded-full opacity-80 animate-float"></div>
</div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shine"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-5xl md:text-7xl font-bold font-baloo mb-4 drop-shadow-lg"
          >
            My Wishlist
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-poppins drop-shadow-md"
          >
            💖 Your favorite dreamy pieces
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loadingWishlist ? (
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
               
                     {/* Loading text */}
                     <motion.p
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.6 }}
                       className="text-gray-600 font-poppins mb-4 text-lg"
                     >
                       Loading dreamy products...
                     </motion.p>
               
                     {/* Animated dots */}
                     <div className="flex justify-center space-x-2">
                       {[0, 1, 2].map((index) => (
                         <motion.div
                           key={index}
                           animate={{ 
                             scale: [1, 1.5, 1],
                             opacity: [0.5, 1, 0.5]
                           }}
                           transition={{ 
                             duration: 1.5, 
                             repeat: Infinity, 
                             ease: "easeInOut",
                             delay: index * 0.2 
                           }}
                           className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                         />
                       ))}
                     </div>
                   </div>
                 </div>
               ) : (
        wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-cute-charcoal mb-4 font-baloo">Your wishlist is empty</h2>
            <p className="text-cute-charcoal opacity-70 mb-8 font-poppins">Start adding some dreamy pieces!</p>
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
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {wishlistItems.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, boxShadow: "0 15px 35px rgba(236, 72, 153, 0.2)" }}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100 hover:border-purple-300 transition-all duration-500 group "
    >
      {/* Image section */}
     {/* Image section */}
<div className="relative overflow-hidden">
  <motion.img
    src={item.product?.image_url}
    alt={item.product?.name}
    className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
  />

  {/* Category (Top-Left) */}
  {item.product?.category && (
    <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md font-poppins">
      {item.product.category}
    </span>
  )}

  {/* Out of Stock Overlay 🔥 */}
  {!item.product?.is_active && (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <span className="text-white font-bold text-lg font-poppins">
        Out of Stock
      </span>
    </div>
  )}

  {/* Delete Button (Top-Right) */}
  <motion.button
    whileHover={{ scale: 1.2, rotate: 12 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => removeFromWishlist(item.id)}
    className="absolute top-3 right-3 bg-red-500/90 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
  >
    <Trash2 className="h-4 w-4" />
  </motion.button>
</div>


      {/* Details */}
      <div className="p-5 bg-gradient-to-br from-pink-200 to-purple-100 ">
        {/* Product name */}
        <h3 className="text-lg  text-cute-charcoal mb-2 font-baloo line-clamp-1 group-hover:text-purple-700 transition-colors duration-300 font-bold">
          {item.product?.name}
        </h3>

        {/* Tags (below image, except category) */}
        <div className="flex flex-wrap gap-2 mb-3">
          {item.product?.tags?.map((tag, i) => (
            <span
              key={i}
              className="bg-white/80 backdrop-blur-sm border border-purple-300 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm font-poppins"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-5 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-md font-poppins"
        >
          ₹ {item.product?.price.toFixed(2)}
        </motion.div>

        {/* Actions */}
        <div className="flex space-x-3">
          {/* View Button (Outlined) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/shop/${item.product_id}`)}
            className="flex-1 border-2 border-purple-500 text-purple-600 py-2 px-4 rounded-xl font-medium transition-all duration-300 font-poppins bg-transparent hover:bg-purple-500 hover:text-white shadow-sm hover:shadow-md"
          >
            View
          </motion.button>

          {/* Cart Button (Solid Gradient) */}
         <motion.button
  whileHover={item.product?.is_active ? { scale: 1.05 } : {}}
  whileTap={item.product?.is_active ? { scale: 0.95 } : {}}
  onClick={() => item.product?.is_active && addToCart(item.product_id)}
  disabled={!item.product?.is_active}  
  className={`relative flex-1 overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl font-medium shadow-md  transition-all duration-300 flex items-center justify-center space-x-1 font-poppins ${item.product?.is_active ? 'hover:shadow-lg' : 'cursor-not-allowed opacity-50 '}`}
>
   <span className="absolute top-0 left-0 w-full h-full bg-white/30 
                     transform -translate-x-full rotate-20 pointer-events-none 
                     animate-shine"></span>
  {addingToCart === item.product_id ? (
    <span>Adding...</span>
  ) : (
    <>
      <ShoppingCart className="h-4 w-4" />
      <span>{item.product?.is_active ? 'Cart' : 'Unavailable'}</span>
    </>
  )}
</motion.button>

        </div>
      </div>
      
    </motion.div>
  ))}
</div>



        ))}
      </div>
    </motion.div>
  );
};