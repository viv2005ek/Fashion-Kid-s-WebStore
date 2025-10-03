import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "../types/product";
import { ProductCard } from "../components/shared/ProductCard";
import { supabase } from "../lib/supabase";
import {Loading} from './Loading';

export const NewArrivals: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "new-arrivals")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNewArrivals(data || []);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    } finally {
      setLoading(false);
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
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pt-10"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-blue-300 to-purple-400 text-white py-16  shadow-xl">
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shine pointer-events-none"></div>

        {/* Floating decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-6 left-10 w-6 h-6 bg-pink-400 rounded-full opacity-80 animate-bounce-slow"></div>
  <div className="absolute top-16 right-12 w-5 h-5 bg-purple-400 rounded-full opacity-70 animate-float"></div>
  <div className="absolute top-24 left-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse-slow"></div>
  
  <div className="absolute bottom-12 left-1/3 w-5 h-5 bg-purple-400 rotate-45 clip-triangle opacity-80 animate-float-reverse"></div>
  <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-pink-500 rotate-45 clip-triangle opacity-70 animate-bounce-slow"></div>
  
  <div className="absolute top-1/3 right-1/3 w-6 h-2 bg-pink-400 rounded opacity-70 animate-float"></div>
  <div className="absolute top-2/5 right-1/2 w-3 h-3 bg-yellow-300 rounded-full opacity-80 animate-float"></div>
</div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-5xl md:text-7xl font-bold font-baloo mb-4 drop-shadow-xl"
          >
            New Arrivals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-poppins drop-shadow-md"
          >
            ✨ Fresh styles just landed
          </motion.p>
        </div>
      </div>
   <div className="absolute inset-0 pointer-events-none">
  
  <div className="absolute bottom-16 left-1/4 w-6 h-2 bg-pink-400 rounded opacity-60 animate-pulse-slow"></div>
  <div className="absolute bottom-10 right-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-80 animate-float"></div>
  
  <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-400 rounded opacity-70 animate-float"></div>
  <div className="absolute top-2/5 left-1/2 w-2 h-2 bg-pink-500 rounded-full opacity-60 animate-bounce-slow"></div>
  <div className="absolute bottom-20 right-1/4 w-3 h-8 bg-purple-300 rounded opacity-70 animate-float-reverse"></div>
</div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {newArrivals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-cute-charcoal text-lg font-poppins">
              No new arrivals at the moment. Check back soon! 😔
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
