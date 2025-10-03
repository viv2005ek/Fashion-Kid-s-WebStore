import React from 'react';
import { motion } from 'framer-motion';
import { Product, Order, Profile } from '../types/product';
import { Package, ShoppingCart, Users, Clock, CheckCircle, XCircle, TrendingUp, Star } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  users: Profile[];
  onTabChange: (tab: string) => void;
  isFetchingData: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  orders, 
  users, 
  isFetchingData,
  onTabChange
}) => {
  const activeProducts = products.filter(p => p.is_active).length;
  const inactiveProducts = products.filter(p => !p.is_active).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  
  // Calculate total revenue from completed orders
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);

  // Calculate average order value
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const statsCards = [
    {
      title: 'Active Products',
      value: activeProducts,
      icon: Package,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-100',
      textColor: 'text-green-700',
      onClick: () => onTabChange('products'),
      description: 'Currently available products'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-100',
      textColor: 'text-yellow-700',
      onClick: () => onTabChange('orders'),
      description: 'Orders awaiting processing'
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-100',
      textColor: 'text-pink-700',
      onClick: () => onTabChange('users'),
      description: 'Registered customers'
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: CheckCircle,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-100',
      textColor: 'text-blue-700',
      onClick: () => onTabChange('orders'),
      description: 'Successfully delivered'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-100',
      textColor: 'text-purple-700',
      onClick: () => onTabChange('orders'),
      description: 'From completed orders'
    },
    {
      title: 'Inactive Products',
      value: inactiveProducts,
      icon: XCircle,
      color: 'from-red-400 to-pink-500',
      bgColor: 'from-red-50 to-pink-100',
      textColor: 'text-red-700',
      onClick: () => onTabChange('products'),
      description: 'Products not available'
    },
    {
      title: 'Avg Order Value',
      value: `₹${averageOrderValue.toFixed(2)}`,
      icon: ShoppingCart,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-100',
      textColor: 'text-amber-700',
      onClick: () => onTabChange('orders'),
      description: 'Average per completed order'
    },
    {
      title: 'Cancelled Orders',
      value: cancelledOrders,
      icon: XCircle,
      color: 'from-gray-400 to-slate-500',
      bgColor: 'from-gray-50 to-slate-100',
      textColor: 'text-gray-700',
      onClick: () => onTabChange('orders'),
      description: 'Cancelled or refunded'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98,
      y: 0
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, -5, 5, -3, 0],
      transition: {
        duration: 0.5
      }
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
          Serving dashboard...
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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-cute-charcoal mb-3 font-baloo bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Dashboard Overview ✨
        </h2>
        <p className="text-lg text-cute-charcoal opacity-75 font-poppins">
          Welcome to your Pastel Dream Store management dashboard
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={stat.onClick}
            className={`relative bg-gradient-to-br ${stat.bgColor} border-2 border-white rounded-3xl p-6 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-50"></div>
            
            {/* Animated Border */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
                
                {/* Sparkle Effect */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((dot) => (
                      <motion.div
                        key={dot}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                        className="w-1 h-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <motion.h3 
                  className={`text-sm font-semibold ${stat.textColor} font-poppins uppercase tracking-wide`}
                  whileHover={{ x: 2 }}
                >
                  {stat.title}
                </motion.h3>
                
                <motion.p 
                  className="text-3xl font-bold text-cute-charcoal font-baloo"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.p>
                
                <motion.p 
                  className="text-xs text-cute-charcoal opacity-60 font-poppins"
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1 }}
                >
                  {stat.description}
                </motion.p>
              </div>

              {/* Click Hint */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute bottom-3 right-3"
              >
                <div className="flex items-center space-x-1 text-xs text-cute-charcoal opacity-60">
                  <span>Click</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {[1, 2, 3].map((particle) => (
                <motion.div
                  key={particle}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-pink-100 via-purple-200 to-blue-100 rounded-3xl p-8 border-2 border-white shadow-lg"
      >
        <h3 className="text-2xl font-bold text-cute-charcoal mb-6 font-baloo text-center">
          Quick Actions 🚀
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Add New Product', tab: 'products', emoji: '🛍️' },
            { label: 'View All Orders', tab: 'orders', emoji: '📦' },
            { label: 'Manage Users', tab: 'users', emoji: '👥' }
          ].map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ 
                scale: 1.05,
                background: "linear-gradient(135deg, #f9a8d4, #c4b5fd)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(action.tab)}
              className="bg-white text-cute-charcoal font-poppins font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-pink-200 flex items-center justify-center space-x-3 group"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span>{action.label}</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="opacity-60 group-hover:opacity-100"
              >
                →
              </motion.span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-6 border-2 border-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-400 rounded-2xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-cute-charcoal font-baloo">Success Rate</h4>
              <p className="text-2xl font-bold text-green-600">
                {orders.length > 0 ? ((completedOrders / orders.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-3xl p-6 border-2 border-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-400 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-cute-charcoal font-baloo">Inventory Health</h4>
              <p className="text-2xl font-bold text-blue-600">
                {products.length > 0 ? ((activeProducts / products.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-6 border-2 border-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-400 rounded-2xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-cute-charcoal font-baloo">Customer Growth</h4>
              <p className="text-2xl font-bold text-purple-600">
                +{users.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};