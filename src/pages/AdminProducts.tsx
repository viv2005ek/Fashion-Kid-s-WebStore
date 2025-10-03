import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types/product';
import { Plus, Edit, Trash2, Search, Filter, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProductForm } from './ProductForm';

interface AdminProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
  isFetchingData: boolean;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ 
  products, 
  setProducts, 
  isFetchingData,
  showToast
}) => {
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Extract categories dynamically from products
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filtering logic
  const filteredProducts = products.filter(product => {
    if (productStatusFilter === 'active' && !product.is_active) return false;
    if (productStatusFilter === 'inactive' && product.is_active) return false;
    if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDesc = product.description?.toLowerCase().includes(query);
      const matchesTags = product.tags?.some((tag: string) => tag.toLowerCase().includes(query));
      if (!matchesName && !matchesDesc && !matchesTags) return false;
    }

    return true;
  });

const handleAddProduct = async (productData: Omit<Product, 'product_id'>) => {
  try {
    // transform data to match DB schema
    const insertData = {
      ...productData,
      price: parseFloat(String(productData.price)), // string → number
      tags: typeof productData.tags === 'string'
        ? productData.tags.split(',').map(tag => tag.trim())
        : productData.tags, // string → array
    };

    const { data, error } = await supabase
      .from('products')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    // ✅ Create notifications for all users when a new product is added
    await createProductNotifications(data);

    setProducts(prev => [data, ...prev]);
    setShowAddProduct(false);
    showToast('Product added successfully!', 'success');
  } catch (error) {
    console.error(error);
    showToast('Failed to add product', 'error');
  }
};

// ✅ New function to create notifications for all users
const createProductNotifications = async (newProduct: Product) => {
  try {
    // Get all users from profiles table
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id');

    if (usersError) throw usersError;

    if (!users || users.length === 0) return;

    // Prepare notifications data for all users
    const notificationsData = users.map(user => ({
      user_id: user.id,
      title: ' New Product Alert!',
      message: `Check out our new product: "${newProduct.name}" - ${newProduct.description?.substring(0, 100)}...`,
      is_read: false,
      created_at: new Date().toISOString()
    }));

    // Insert notifications in batches to avoid payload limits
    const batchSize = 50;
    for (let i = 0; i < notificationsData.length; i += batchSize) {
      const batch = notificationsData.slice(i, i + batchSize);
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(batch);

      if (notificationError) {
        console.error('Error inserting notifications batch:', notificationError);
        // Continue with next batches even if one fails
      }
    }

    console.log(`Created notifications for ${users.length} users`);
  } catch (error) {
    console.error('Error creating product notifications:', error);
    // Don't throw error here to avoid affecting product creation
  }
};

const handleUpdateProduct = async (productData: Omit<Product, 'product_id'>) => {
  if (!editingProduct) return;

  try {
    const updateData = {
      ...productData,
      price: parseFloat(String(productData.price)),
      tags: typeof productData.tags === 'string'
        ? productData.tags.split(',').map(tag => tag.trim())
        : productData.tags,
    };

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('product_id', editingProduct.product_id)
      .select()
      .single();

    if (error) throw error;

    setProducts(prev =>
      prev.map(p =>
        p.product_id === editingProduct.product_id ? data : p
      )
    );
    setEditingProduct(null);
    showToast('Product updated successfully!', 'success');
  } catch (error) {
    console.error(error);
    showToast('Failed to update product', 'error');
  }
};


  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('product_id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(p => 
        p.product_id === productId ? { ...p, is_active: !currentStatus } : p
      ));
      showToast(`Product ${!currentStatus ? 'activated' : 'deactivated'}!`, 'success');
    } catch (error) {
      showToast('Failed to update product status', 'error');
    }
  };
if (isFetchingData) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
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

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-600 font-poppins mb-4 text-lg"
        >
          Testing Products...
        </motion.p>

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
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 lg:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8"
      >
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent font-baloo">
            Product Management
          </h2>
          <p className="text-gray-600 font-poppins mt-2">
            Manage your products and inventory
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddProduct(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-poppins w-full lg:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </motion.button>
      </motion.div>

      {/* Search and Filter Bar */}
    <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-8"
>


        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all font-poppins bg-gray-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-gray-100 text-gray-700 px-4 py-3 rounded-xl flex items-center space-x-2 justify-center font-poppins"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters - Responsive */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 lg:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Status Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Products', color: 'from-pink-400 to-purple-600' },
                  { id: 'active', label: 'Active', color: 'from-green-400 to-green-600' },
                  { id: 'inactive', label: 'Inactive', color: 'from-red-400 to-red-600' }
                ].map(tab => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProductStatusFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-xl font-poppins transition-all flex-1 min-w-[120px] ${
                      productStatusFilter === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent appearance-none bg-gray-50 font-poppins"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Products Grid */}
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
  className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-2"
>
  <div className="grid gap-4 lg:gap-6">

        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 font-baloo mb-2">
              No products found
            </h3>
            <p className="text-gray-500 font-poppins">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </motion.div>
        ) : (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Product Image */}
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-xl shadow-md flex-shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-800 font-baloo truncate">
                      {product.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium font-poppins flex-shrink-0 ${
                      product.is_active 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 font-poppins line-clamp-2 mb-2">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <p className="text-xl font-bold text-purple-600 font-baloo">
                      Rs. {product.price}
                    </p>
                    <span className="text-gray-500 font-poppins bg-gray-100 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{product.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 sm:flex-none bg-purple-50 text-purple-800 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors flex items-center justify-center space-x-2 font-poppins"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sm:hidden">Edit</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleProductStatus(product.product_id, product.is_active)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-colors flex items-center justify-center space-x-2 font-poppins ${
                      product.is_active
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {product.is_active ? (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span className="sm:hidden">Deactivate</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span className="sm:hidden">Activate</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddProduct || editingProduct) && (
          <ProductForm
            product={editingProduct}
            onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
            onClose={() => {
              setShowAddProduct(false);
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};