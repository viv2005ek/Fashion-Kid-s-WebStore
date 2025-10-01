import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../shared/ProductCard';
import { Product } from '../../types/product';
import { supabase } from '../../lib/supabase';

export const BestSellersSection: React.FC = () => {
  const [bestSellers, setBestSellers] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'best-sellers')
        .limit(4);

      if (error) throw error;
      setBestSellers(data || []);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-gradient-to-br from-cute-cloud-blue via-white to-cute-cloud-mint py-16 relative overflow-hidden">
      {/* Floating decorative elements */}
   <div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-8 left-12 w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-400 rounded opacity-90 animate-float"></div>
  <div className="absolute top-20 right-16 w-6 h-6 bg-pink-300 rounded-full opacity-80 animate-bounce-slow"></div>
  <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-purple-300 rounded opacity-70 animate-float-reverse"></div>
  <div className="absolute bottom-16 left-1/4 w-6 h-2 bg-pink-400 rounded opacity-60 animate-pulse-slow"></div>
  <div className="absolute bottom-10 right-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-80 animate-float"></div>
  <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-400 rounded opacity-70 animate-float"></div>
  <div className="absolute top-2/5 left-1/2 w-2 h-2 bg-pink-500 rounded-full opacity-60 animate-bounce-slow"></div>
  <div className="absolute bottom-20 right-1/4 w-3 h-8 bg-purple-300 rounded opacity-70 animate-float-reverse"></div>

  <div className="absolute top-1/2 left-20 w-8 h-8 bg-blue-300 rounded-full opacity-70 animate-float"></div>
  <div className="absolute bottom-8 left-12 w-5 h-5 bg-green-300 rounded opacity-80 animate-bounce-slow"></div>
  <div className="absolute top-16 right-1/2 w-4 h-4 bg-yellow-400 rounded opacity-60 animate-pulse-slow"></div>
  <div className="absolute bottom-1/4 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-90 animate-float-reverse"></div>
  <div className="absolute top-1/4 left-16 w-3 h-3 bg-purple-500 rounded opacity-70 animate-float"></div>
  <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-orange-400 rounded-full opacity-80 animate-bounce-slow"></div>
</div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-cute-charcoal mb-4 font-baloo drop-shadow-sm">
            Bestsellers
          </h2>
          <p className="text-cute-charcoal opacity-80 text-lg font-poppins">
            Shop our most fashionable pieces that our guests adore
          </p>
        </motion.div>

    {loading ? (
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {bestSellers.map((product, index) => (
      <motion.div
        key={product.product_id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <ProductCard product={product} />
      </motion.div>
    ))}
  </div>
)}
      </div>
    </section>
  );
};