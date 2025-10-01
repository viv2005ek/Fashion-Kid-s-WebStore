import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Order, Profile } from '../types/product';
import { Plus, Users, Package, ShoppingBag, Upload, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/shared/Toast';

export const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    tags: '',
    tag: '',
    category: 'new-arrivals'
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (!isAdmin) {
        showToast('Access unauthorized', 'error');
        setTimeout(() => navigate('/'), 2000);
        return;
      }
      
      fetchAdminData();
    }
  }, [user, isAdmin, loading]);

  const fetchAdminData = async () => {
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch orders with user details
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(name, email)
        `)
        .order('created_at', { ascending: false });
      
      // Fetch users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setProducts(productsData || []);
      setOrders(ordersData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          image_url: newProduct.image_url,
          tags: newProduct.tags.split(',').map(tag => tag.trim()),
          tag: newProduct.tag,
          category: newProduct.category
        })
        .select()
        .single();

      if (error) throw error;

      // Add notification to all users
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id');

      if (allUsers) {
        const notifications = allUsers.map(user => ({
          user_id: user.id,
          title: 'New Product Added!',
          message: `Check out our new product: ${newProduct.name}`,
          is_read: false
        }));

        await supabase
          .from('notifications')
          .insert(notifications);
      }

      setProducts(prev => [data, ...prev]);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        image_url: '',
        tags: '',
        tag: '',
        category: 'new-arrivals'
      });
      setShowAddProduct(false);
      showToast('Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Error adding product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-baloo text-cute-charcoal">Loading... ✨</div>
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
        className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-baloo mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl font-poppins">
              🛠️ Manage your store
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100">
                <nav className="space-y-2">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: Package },
                    { id: 'products', label: 'Products', icon: ShoppingBag },
                    { id: 'orders', label: 'Orders', icon: Package },
                    { id: 'users', label: 'Users', icon: Users },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-poppins ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-pink-200 to-purple-200 text-cute-charcoal font-medium'
                          : 'text-cute-charcoal hover:bg-pink-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-pink-100">
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="text-2xl font-bold text-cute-charcoal mb-6 font-baloo">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-cute-charcoal mb-2">{products.length}</div>
                        <div className="text-cute-charcoal font-poppins">Total Products</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-200 to-blue-200 rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-cute-charcoal mb-2">{orders.length}</div>
                        <div className="text-cute-charcoal font-poppins">Total Orders</div>
                      </div>
                      <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-cute-charcoal mb-2">{users.length}</div>
                        <div className="text-cute-charcoal font-poppins">Total Users</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-cute-charcoal font-baloo">Products</h2>
                      <button
                        onClick={() => setShowAddProduct(true)}
                        className="bg-gradient-to-r from-green-300 to-blue-300 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-poppins"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Product</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.product_id} className="border-2 border-pink-100 rounded-2xl p-4 flex items-center space-x-4">
                          <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-cute-charcoal font-baloo">{product.name}</h3>
                            <p className="text-cute-charcoal opacity-70 font-poppins">Rs. {product.price}</p>
                          </div>
                          <span className="bg-gradient-to-r from-pink-200 to-purple-200 text-cute-charcoal px-3 py-1 rounded-full text-sm font-medium">
                            {product.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-bold text-cute-charcoal mb-6 font-baloo">Orders</h2>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border-2 border-pink-100 rounded-2xl p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-cute-charcoal font-poppins">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-cute-charcoal font-poppins">Rs. {order.total_amount}</p>
                              <span className="bg-gradient-to-r from-green-200 to-blue-200 text-cute-charcoal px-3 py-1 rounded-full text-sm font-medium">
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-2xl font-bold text-cute-charcoal mb-6 font-baloo">Users</h2>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="border-2 border-pink-100 rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-cute-charcoal font-poppins">{user.name || 'No name'}</p>
                            <p className="text-cute-charcoal opacity-70 text-sm font-poppins">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                              Joined: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-cute-charcoal font-baloo">Add New Product</h3>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="text-cute-charcoal hover:text-red-500 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">Description</label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">Tags (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                    placeholder="e.g. dress, pink, casual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">Tag</label>
                  <select
                    required
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                  >
                    <option value="">Select tag</option>
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">Category</label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                  >
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="best-sellers">Best Sellers</option>
                    <option value="sale">Sale</option>
                    <option value="gift">Gift</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-300 to-purple-300 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
                >
                  Add Product
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};