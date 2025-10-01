import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../types/product';
import {Loading} from './Loading';

export const Notifications: React.FC = () => {
  const { user, loading } = useAuth();   // ✅ use loading state too
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotification, setLoadingNotification] = useState(true);

  useEffect(() => {
        if (loading) return; // ✅ wait until auth state is known

    if (!user) {
      navigate('/auth');
      return;
    }
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotification(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
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
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-300 to-orange-300 text-white py-16 relative overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shine"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-5xl md:text-7xl font-bold font-baloo mb-4 drop-shadow-lg"
          >
            Notifications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-poppins drop-shadow-md"
          >
            🔔 Stay updated with your dreamy journey
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
         {loadingNotification ? (
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
                Loading dreamy Notifications...
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
        notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔕</div>
            <h2 className="text-2xl font-bold text-cute-charcoal mb-4 font-baloo">No notifications yet</h2>
            <p className="text-cute-charcoal opacity-70 font-poppins">We'll notify you about exciting updates!</p>
          </div>
        ) : (
       <div 
  className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
  style={{
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgb(253 224 71 / 0.8) rgb(254 215 170 / 0.5)'
  }}
>
  {/* Custom scrollbar styles for Webkit browsers */}
  <style>
    {`
      .notifications-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .notifications-scroll::-webkit-scrollbar-track {
        background: rgb(254 215 170 / 0.5);
        border-radius: 10px;
      }
      .notifications-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, rgb(253 224 71 / 0.8), rgb(251 146 60 / 0.8));
        border-radius: 10px;
        border: 2px solid rgb(254 215 170 / 0.5);
      }
      .notifications-scroll::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, rgb(250 204 21 / 0.9), rgb(249 115 22 / 0.9));
      }
    `}
  </style>

  {notifications.map((notification, index) => (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 notifications-scroll ${
        notification.is_read 
          ? 'border-gray-200 opacity-75' 
          : 'border-yellow-200 shadow-yellow-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Bell className={`h-5 w-5 ${notification.is_read ? 'text-gray-400' : 'text-yellow-500'}`} />
            <h3 className="text-lg font-semibold text-cute-charcoal font-baloo">
              {notification.title}
            </h3>
            {!notification.is_read && (
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 text-white px-2 py-1 rounded-full text-xs font-bold">
                New
              </span>
            )}
          </div>
          <p className="text-cute-charcoal opacity-80 font-poppins mb-3">
            {notification.message}
          </p>
          <p className="text-cute-charcoal opacity-60 text-sm font-poppins">
            {new Date(notification.created_at).toLocaleDateString()} at{' '}
            {new Date(notification.created_at).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex space-x-2 ml-4">
          {!notification.is_read && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => markAsRead(notification.id)}
              className="bg-green-200 text-green-700 p-2 rounded-full hover:bg-green-300 transition-all duration-300"
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </motion.button>
          )}
          {notification.is_read && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => deleteNotification(notification.id)}
              className="bg-red-200 text-red-600 p-2 rounded-full hover:bg-red-300 transition-all duration-300"
              title="Delete notification"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  ))}
</div>
        ))}
      </div>
    </motion.div>
  );
};