import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Order } from '../types/product';
import { X, Search, Filter, User, Mail, Phone, Calendar, Package, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminOrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
  isFetchingData: boolean;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, setOrders, showToast, isFetchingData }) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (selectedOrder) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [selectedOrder]);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedOrder) {
        setSelectedOrder(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (selectedOrder && target.classList.contains('modal-overlay')) {
        setSelectedOrder(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-200 to-green-300 text-green-800';
      case 'cancelled': return 'from-red-200 to-red-300 text-red-800';
      default: return 'from-yellow-200 to-orange-200 text-orange-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '⏳';
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const orderIdMatch = order.id.toLowerCase().includes(searchLower);
      const customerNameMatch = order.user_profile?.name?.toLowerCase().includes(searchLower);
      const amountMatch = order.total_amount.toString().includes(searchTerm);
      
      return statusMatch && (orderIdMatch || customerNameMatch || amountMatch);
    });
  }, [orders, searchTerm, statusFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      showToast(`Order status updated to ${newStatus}!`, 'success');

      // Notify the user about the status change
      if (updatedOrder) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: updatedOrder.user_id,
            title: 'Order Status Updated',
            message: `Your order #${orderId.slice(0, 8)} status has been updated to "${newStatus}".`,
            is_read: false,
          });

        if (notifError) throw notifError;
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('❌ Error updating order status', 'error');
    }
  };

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(order => order.status === 'pending').length,
      completed: orders.filter(order => order.status === 'completed').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
    };
  }, [orders]);
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
          Getting Orders...
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cute-charcoal font-baloo">
          Orders ({filteredOrders.length})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-gradient-to-r text-white from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400  px-4 py-2 rounded-xl transition-all duration-200 font-poppins"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 space-y-4"
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent font-poppins"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-xl font-poppins transition-all duration-200 ${
                  statusFilter === key
                    ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow'
                    : 'bg-gray-100 text-cute-charcoal hover:bg-gray-200'
                }`}
              >
                {label} ({statusCounts[key as keyof typeof statusCounts]})
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Orders List with Fixed Height and Scroll */}
      <div 
        className="space-y-4 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cute-charcoal opacity-70 font-poppins">
              {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-pink-100 rounded-2xl p-4 hover:shadow-md transition cursor-pointer bg-white"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-cute-charcoal font-poppins">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                    Customer: {order.user_profile?.name || 'Unknown'}
                  </p>
                  <p className="text-cute-charcoal opacity-70 text-sm font-poppins">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-cute-charcoal font-poppins">
                    Rs. {order.total_amount}
                  </p>
                  <span className={`bg-gradient-to-r ${getStatusColor(order.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden border-2 border-pink-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white font-baloo">
                    Order Details 🛍️
                  </h3>
                  <p className="text-pink-100 text-sm font-poppins mt-1">
                    #{selectedOrder.id.slice(0, 8)} • {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:text-pink-200 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
            </div>

            {/* Content with Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
                  <h4 className="text-lg font-semibold text-cute-charcoal mb-4 font-baloo flex items-center">
                    <User className="h-5 w-5 mr-2 text-pink-500" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-pink-400" />
                      <div>
                        <p className="text-sm text-cute-charcoal/60">Name</p>
                        <p className="font-medium">{selectedOrder.user_profile?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-pink-400" />
                      <div>
                        <p className="text-sm text-cute-charcoal/60">Email</p>
                        <p className="font-medium">{selectedOrder.user_profile?.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-pink-400" />
                      <div>
                        <p className="text-sm text-cute-charcoal/60">Phone</p>
                        <p className="font-medium">{selectedOrder.user_profile?.phone || 'No phone'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-pink-400" />
                      <div>
                        <p className="text-sm text-cute-charcoal/60">Order Date</p>
                        <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-white rounded-2xl p-6 border-2 border-pink-200">
                  <h4 className="text-lg font-semibold text-cute-charcoal mb-4 font-baloo flex items-center">
                    <Package className="h-5 w-5 mr-2 text-purple-500" />
                    Order Status
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { status: 'pending', label: '⏳ Pending', color: 'from-yellow-400 to-orange-400' },
                      { status: 'completed', label: '✅ Completed', color: 'from-green-400 to-emerald-400' },
                      { status: 'cancelled', label: '❌ Cancelled', color: 'from-red-400 to-rose-400' }
                    ].map(({ status, label, color }) => (
                      <motion.button
                        key={status}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        className={`px-6 py-3 rounded-xl font-poppins font-medium text-white transition-all ${
                          selectedOrder.status === status
                            ? `bg-gradient-to-r ${color} shadow-lg scale-105`
                            : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                        }`}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl p-6 border-2 border-pink-200">
                  <h4 className="text-lg font-semibold text-cute-charcoal mb-4 font-baloo flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-500" />
                    Order Items ({selectedOrder.order_items?.length || 0})
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-pink-50 rounded-2xl p-4 border border-pink-200"
                      >
                        <img
                          src={item.products?.image_url}
                          alt={item.products?.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-md"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-cute-charcoal">{item.products?.name}</p>
                          <p className="text-sm text-cute-charcoal/60">Quantity: {item.quantity}</p>
                          <p className="text-sm text-cute-charcoal/60">Price per item: Rs. {item.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-cute-charcoal">Rs. {item.price * item.quantity}</p>
                          <p className="text-sm text-cute-charcoal/60">{item.quantity} × Rs. {item.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white">
                  <h4 className="text-lg font-semibold mb-4 font-baloo flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Order Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Subtotal:</span>
                      <span>Rs. {selectedOrder.total_amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Payment Method:</span>
                      <span className="capitalize">{selectedOrder.payment_method || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/30">
                      <span className="font-bold text-lg">Total Amount:</span>
                      <span className="font-bold text-xl">Rs. {selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Custom Scrollbar Styles */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #fdf2f8;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #ec4899, #8b5cf6);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #db2777, #7c3aed);
            }
          `}</style>
        </div>
      )}
    </div>
  );
};