import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Toast } from './Toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleCardClick = () => {
    navigate(`/shop/${product.product_id}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.product_id);
        setIsLiked(false);
      } else {
        await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: product.product_id,
          });
        setIsLiked(true);
      }
      showToast(isLiked ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showToast('Error updating wishlist', 'error');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsAddingToCart(true);
    try {
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.product_id)
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
            user_id: user.id,
            product_id: product.product_id,
            quantity: 1,
          });
      }
      showToast('Added to cart successfully!', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Error adding to cart', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWhatsAppQuery = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hey, I want to know about ${product.name} - ${product.category} - Rs. ${product.price.toFixed(2)}`;
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ 
          y: -8,
          boxShadow: "0 20px 40px rgba(251, 207, 232, 0.3)" 
        }}
        className={`relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-pink-100 cursor-pointer group ${className}`}
        onClick={handleCardClick}
      >
        {/* Main Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
          <AnimatePresence>
            {!isImageLoaded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-pink-300"
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 object-cover"
            onLoad={() => setIsImageLoaded(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Category Tag - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          >
            {product.category}
          </motion.div>

          {/* Like Button - Top Right */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLikeClick}
            className={`absolute top-4 right-4 p-2 rounded-full shadow-lg backdrop-blur-sm ${
              isLiked 
                ? 'bg-gradient-to-r from-pink-400 to-red-400 text-white' 
                : 'bg-white/90 text-gray-400 hover:text-pink-400'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Content Section */}
        <div className="p-6">

          
          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-800 mb-3 font-baloo leading-tight">
            {product.name}
          </h3>

          {/* Tags - Circular Rectangular with Glow */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.slice(0, 2).map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 px-3 py-1.5 rounded-2xl text-xs font-medium border border-blue-200 shadow-sm glow-on-hover"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Price and Actions Row */}
          <div className="flex items-center justify-between mb-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
            >
              Rs. {product.price.toFixed(2)}
            </motion.span>
          </div>

          {/* Action Buttons */}
        <div className="flex flex-row space-x-6 w-full">
  {/* WhatsApp Query Button (Left) */}
  <div className="flex-1 transition-all duration-300 hover:flex-[3_1_0%]">
    <button
      onClick={handleWhatsAppQuery}
      className="group/button w-full h-12 
                 border-2 border-pink-500 text-pink-500 
                 rounded-2xl font-semibold shadow-lg hover:shadow-xl 
                 transition-all duration-300 flex items-center justify-center 
                 font-poppins overflow-hidden"
    >
      <MessageCircle className="h-5 w-5 flex-shrink-0" />
      <span
        className="ml-2 max-w-0 group-hover/button:max-w-[120px] 
                   opacity-0 group-hover/button:opacity-100 
                   transition-all duration-300 whitespace-nowrap overflow-hidden"
      >
        Any Query?
      </span>
    </button>
  </div>

  {/* Add to Cart Button (Right) */}
  <div className="flex-1 transition-all duration-300 hover:flex-[3_1_0%]">
  <button
    onClick={handleAddToCart}
    disabled={isAddingToCart}
    className="group/button relative w-full h-12 
               bg-gradient-to-r from-purple-500 to-pink-500 text-white 
               rounded-2xl font-semibold shadow-lg hover:shadow-xl 
               transition-all duration-300 flex items-center justify-center 
               font-poppins overflow-hidden"
  >
    <ShoppingCart className="h-5 w-5 flex-shrink-0" />
    <span
      className="ml-2 max-w-0 group-hover/button:max-w-[120px] 
                 opacity-0 group-hover/button:opacity-100 
                 transition-all duration-300 whitespace-nowrap overflow-hidden"
    >
      {isAddingToCart ? "Adding..." : "Add to Cart"}
    </span>

    {/* Shine Overlay */}
    <span className="absolute top-0 left-0 w-full h-full bg-white/30 
                     transform -translate-x-full rotate-12 pointer-events-none 
                     animate-shine"></span>
  </button>
</div>

  
</div>
        </div>

        {/* Hover Overlay Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-pink-200/10 to-purple-200/10 pointer-events-none rounded-3xl transition-all duration-300"
        />
      </motion.div>
    </>
  );
};

// Add this CSS for the glow effect
const styles = `
.glow-on-hover {
  transition: all 0.3s ease;
}

.glow-on-hover:hover {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
  transform: translateY(-1px);
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);