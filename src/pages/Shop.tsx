import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "../types/product";
import { ProductCard } from "../components/shared/ProductCard";
import { supabase } from "../lib/supabase";
import { Grid, Rows, Search } from "lucide-react";
import {Loading} from './Loading';

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "All Products" },
    { id: "new-arrivals", name: "New Arrivals" },
    { id: "best-sellers", name: "Best Sellers" },
    { id: "sale", name: "Sale" },
    { id: "gift", name: "Gift" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [products, selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndFilter = () => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
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

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 text-white py-16">
        {/* Shine overlay */}
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-5xl md:text-7xl font-bold font-baloo mb-4 drop-shadow-xl"
          >
            Shop Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-poppins drop-shadow-md"
          >
            ✨ Discover your perfect style
          </motion.p>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl mt-6 mx-2 md:mx-6 lg:mx-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start w-full lg:w-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryFilter(category.id)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium font-poppins transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg"
                : "bg-white text-cute-charcoal hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 hover:text-white shadow-md"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Search + View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-48 lg:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-300 font-poppins text-cute-charcoal shadow-sm outline-none transition-all duration-300 text-sm sm:text-base"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>

        {/* Product Count + View Controls Container */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          {/* Product Count */}
          <span className="text-cute-charcoal font-poppins text-sm sm:text-base whitespace-nowrap">
            {filteredProducts.length} products
          </span>

          {/* View Controls */}
          <div className="flex space-x-1 sm:space-x-2">
            {/* Grid View */}
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 sm:p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg"
                  : "text-cute-charcoal hover:bg-pink-100"
              }`}
            >
              <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Row View */}
            <button
              onClick={() => setViewMode("row")}
              className={`p-2 sm:p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                viewMode === "row"
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg"
                  : "text-cute-charcoal hover:bg-pink-100"
              }`}
            >
              <Rows className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "grid grid-cols-1 lg:grid-cols-2 gap-6 "
          }`}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={viewMode === "row" ? "w-full" : ""}
            >
              <ProductCard
                product={product}
                className={
                  viewMode === "row" 
                    ? "flex flex-row w-full min-h-[250px] max-w-none" 
                    : ""
                }
              />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-cute-charcoal text-lg font-poppins">
              No products found. 😔
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};