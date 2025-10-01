import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react';
import { Product } from '../types/product';
import { ProductCard } from '../components/shared/ProductCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/shared/Toast';
import { Loading } from './Loading';

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      // Fetch main product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Fetch related products (same category or tags)
      const { data: relatedData, error: relatedError } = await supabase
        .from('products')
        .select('*')
        .or(`category.eq.${productData.category},tags.cs.{${productData.tags.join(',')}}`)
        .neq('product_id', productId)
        .limit(4);

      if (relatedError) throw relatedError;
      setRelatedProducts(relatedData || []);

      // Check if product is in wishlist
      if (user) {
        const { data: wishlistData } = await supabase
          .from('wishlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single();

        setIsLiked(!!wishlistData);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async () => {
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
          .eq('product_id', productId);
        setIsLiked(false);
      } else {
        await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId!,
          });
        setIsLiked(true);
      }
      showToast(isLiked ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showToast('Error updating wishlist', 'error');
    }
  };

  const handleAddToCart = async () => {
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
            user_id: user.id,
            product_id: productId!,
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

  const handleWhatsAppQuery = () => {
    const message = `Hey, I want to know about ${product?.name} - ${product?.category} - Rs. ${product?.price.toFixed(2)}`;
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-baloo text-cute-charcoal">Product not found 😔</div>
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
        className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-10"
      >
        {/* Header with Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="group bg-white/80 backdrop-blur-sm text-cute-charcoal px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 font-poppins mb-8 border border-pink-200 hover:border-purple-300"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Browse</span>
          </motion.button>

          {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
  {/* Product Image */}
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="relative"
  >
    <div 
      className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-100 hover:border-purple-200 transition-all duration-300 cursor-pointer"
      onClick={() => document.getElementById('image-modal')?.classList.remove('hidden')}
    >
      <div className="relative w-full h-96 sm:h-[28rem] lg:h-[32rem]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain"
        />
        
        {/* Tag Badge */}
        <span className="absolute top-4 left-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          {product.tag}
        </span>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleLikeClick();
          }}
          className={`absolute top-4 right-4 p-3 rounded-2xl shadow-lg transition-all duration-300 ${
            isLiked 
              ? 'bg-gradient-to-r from-pink-400 to-red-400 text-white' 
              : 'bg-white/90 text-pink-400 hover:bg-pink-50'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </motion.button>
      </div>
    </div>
  </motion.div>

  {/* Product Info */}
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="space-y-6"
  >
    {/* Product Header */}
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-pink-100">
      {/* Category */}
      <div className="mb-4">
        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-cute-charcoal px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
          {product.category}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gradient-to-r from-pink-100 to-purple-100 text-cute-charcoal px-3 py-1 rounded-full text-xs font-medium border border-pink-200"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-cute-charcoal font-baloo mb-4">
        {product.name}
      </h1>

      {/* Description */}
      <p className="text-cute-charcoal/80 text-base leading-relaxed font-poppins mb-4">
        {product.description}
      </p>

      {/* Price */}
      <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Rs. {product.price.toFixed(2)}
      </div>
    </div>

    {/* Action Buttons - Side by Side */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppQuery}
        className="bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 font-poppins text-base"
      >
        <MessageCircle className="h-5 w-5" />
        <span>Any Query?</span>
      </motion.button>
   <motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleAddToCart}
  disabled={isAddingToCart}
  className="relative overflow-hidden bg-gradient-to-l from-pink-500 to-purple-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 font-poppins text-base disabled:opacity-50 disabled:cursor-not-allowed"
>
  <ShoppingCart className="h-5 w-5" />
  <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>

  {/* Shine Overlay */}
  <span className="absolute top-0 left-0 w-full h-full bg-white/30 transform -translate-x-full rotate-5 pointer-events-none animate-shine"></span>
</motion.button>


     
    </div>
  </motion.div>
</div>

{/* Image Modal */}
<div
  id="image-modal"
  className="hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  onClick={() => document.getElementById('image-modal')?.classList.add('hidden')}
>
  <div className="relative max-w-4xl max-h-full">
    {/* Close Button */}
    <button
      className="absolute -top-12 right-0 text-white hover:text-pink-200 transition-colors duration-300 text-sm flex items-center space-x-2"
      onClick={() => document.getElementById('image-modal')?.classList.add('hidden')}
    >
      <span>Press ESC or click outside to close</span>
    </button>
    
    <div 
      className="bg-white rounded-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-full object-contain max-h-[80vh]"
      />
    </div>
    
    {/* Close Button inside image */}
    <button
      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300"
      onClick={() => document.getElementById('image-modal')?.classList.add('hidden')}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-cute-charcoal font-baloo">
                  You Might Also Like ✨
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.product_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard product={relatedProduct} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};