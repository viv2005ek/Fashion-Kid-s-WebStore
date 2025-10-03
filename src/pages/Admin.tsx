/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Order, Profile } from '../types/product';
import { Plus, Users, Package, ShoppingBag, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/shared/Toast';
import { Loading } from './Loading';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminUsers } from './AdminUsers';

export const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(false);


  // Direct admin check function
  const checkAdminStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    return !error && data !== null;
  };

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (loading) return;
      if (!user) {
        navigate('/auth');
        return;
      }

      const isUserAdmin = await checkAdminStatus(user.id);
      if (!isUserAdmin) {
        showToast('⛔ Access unauthorized - Admin only', 'error');
        setTimeout(() => navigate('/'), 1500);
        return;
      }

      setIsCheckingAccess(false);
      await fetchAdminData();
    };

    verifyAdminAccess();
  }, [user, loading]);

  const fetchAdminData = async () => {
  setIsFetchingData(true);
  try {
    // Products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (productsError) throw productsError;

    // Orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (ordersError) throw ordersError;

    let ordersWithUsers: any[] = [];
    if (ordersData) {
      ordersWithUsers = await Promise.all(
        ordersData.map(async (order) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, email, phone')
            .eq('id', order.user_id)
            .single();

          const { data: orderItems } = await supabase
            .from('order_items')
            .select('*, products(name, image_url)')
            .eq('order_id', order.id);

          return {
            ...order,
            user_profile: profileData || { name: 'Unknown', email: 'No email', phone: 'No phone' },
            order_items: orderItems || []
          };
        })
      );
    }

    // Users
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (usersError) throw usersError;

    setProducts(productsData || []);
    setOrders(ordersWithUsers);
    setUsers(usersData || []);
  } catch (error) {
    console.error('Error fetching admin data:', error);
    showToast('❌ Error loading admin data', 'error');
  } finally {
    setIsFetchingData(false);
  }
};


  // Show loading while checking access
  if (loading || isCheckingAccess) {
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
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pt-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-pink-400 to-purple-400 text-white py-16 shadow-lg overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-baloo mb-3 drop-shadow-lg">
              Admin Dashboard
            </h1>
            <p className="text-lg md:text-xl font-poppins drop-shadow-md">
              🛠️ Manage your Pastel Dream Store
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shine"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-pink-100">
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-poppins ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-pink-200 to-purple-200 text-cute-charcoal font-medium shadow'
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
              <div className="bg-white rounded-2xl shadow-md p-8 border border-pink-100">

{activeTab === 'dashboard' && (
  <AdminDashboard 
    products={products} 
    orders={orders} 
    users={users}
    onTabChange={setActiveTab} // Add this line
    isFetchingData={isFetchingData} // Add this line
  />
)}

                {activeTab === 'products' && (
                  <AdminProducts 
                    products={products} 
                    setProducts={setProducts}
                    showToast={showToast}
                     isFetchingData={isFetchingData} // Add this line
                  />
                )}

                {activeTab === 'orders' && (
                  <AdminOrders 
                    orders={orders} 
                    setOrders={setOrders}
                    showToast={showToast}
                     isFetchingData={isFetchingData} // Add this line
                  />
                )}

                {activeTab === 'users' && (
                  <AdminUsers users={users} isFetchingData={isFetchingData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};