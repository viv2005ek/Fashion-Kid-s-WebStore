import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, ShoppingBag, User, Bell, Package, Home, Store, Star, Info, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: Store },
    { name: 'New Arrivals', path: '/new-arrivals', icon: Star },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact Us', path: '/contact', icon: Phone },
  ];

  const userLinks = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Orders', path: '/profile/orders', icon: Package },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
    { name: 'Cart', path: '/cart', icon: ShoppingBag },
    { name: 'Notifications', path: '/notifications', icon: Bell, hasNotification: hasNewNotifications },
  ];

  // Check for new notifications
  useEffect(() => {
    if (!user) return;

    const checkNewNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .limit(1);

      if (!error && data && data.length > 0) {
        setHasNewNotifications(true);
      }
    };

    checkNewNotifications();

    // Subscribe to real-time notifications
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setHasNewNotifications(true);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  // Close navbar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 shadow-lg relative z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Responsive */}
          <Link to="/" className="flex-shrink-0">
            <motion.h1 
              className="font-bold text-cute-charcoal font-baloo drop-shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
               {/* Full logo for md and above */}
    <span className="hidden sm:block text-2xl">✨ Pastel Dream</span>
    {/* Medium logo for sm to md */}
  <span className="hidden min-[375px]:block sm:hidden text-xl">✨ P Dream</span>
    {/* Small logo for below 375px */}
    <span className="min-[375px]:hidden text-lg">✨ PD</span>
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium font-poppins transition-all duration-300 relative group ${
                    isActive(link.path)
                      ? 'text-cute-charcoal font-semibold'
                      : 'text-cute-charcoal hover:text-pink-600'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/notifications" className="relative">
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                    <Bell className="h-5 w-5 text-cute-charcoal cursor-pointer hover:text-pink-500 transition-colors duration-300" />
                    {hasNewNotifications && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                      />
                    )}
                  </motion.div>
                </Link>
                <Link to="/wishlist">
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                    <Heart className="h-5 w-5 text-cute-charcoal cursor-pointer hover:text-pink-500 transition-colors duration-300" />
                  </motion.div>
                </Link>
                <Link to="/cart">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <ShoppingBag className="h-5 w-5 text-cute-charcoal cursor-pointer hover:text-pink-500 transition-colors duration-300" />
                  </motion.div>
                </Link>
                <Link to="/profile/orders">
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                    <Package className="h-5 w-5 text-cute-charcoal cursor-pointer hover:text-pink-500 transition-colors duration-300" />
                  </motion.div>
                </Link>
                <Link to="/profile">
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                    <User className="h-5 w-5 text-cute-charcoal cursor-pointer hover:text-pink-500 transition-colors duration-300" />
                  </motion.div>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                      <span className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded-full font-bold">
                        Admin
                      </span>
                    </motion.div>
                  </Link>
                )}
              </>
            ) : (
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
                >
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile menu button with icons */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* For Regular Users */}
            {user && !isAdmin && (
              <div className="flex items-center space-x-3">
                {/* Always show these icons for users */}
                <Link to="/shop" className="text-cute-charcoal">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Store className="h-5 w-5" />
                  </motion.div>
                </Link>
                <Link to="/wishlist" className="text-cute-charcoal">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Heart className="h-5 w-5" />
                  </motion.div>
                </Link>
                <Link to="/cart" className="text-cute-charcoal">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <ShoppingBag className="h-5 w-5" />
                  </motion.div>
                </Link>
                <Link to="/notifications" className="relative text-cute-charcoal">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Bell className="h-5 w-5" />
                    {hasNewNotifications && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"
                      />
                    )}
                  </motion.div>
                </Link>
              </div>
            )}

            {/* For Admin Users */}
            {user && isAdmin && (
              <div className="flex items-center space-x-3">
                {/* Always show these icons for admin */}
                <Link to="/shop" className="text-cute-charcoal">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Store className="h-5 w-5" />
                  </motion.div>
                </Link>
                 <Link to="/notifications" className="relative text-cute-charcoal">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Bell className="h-5 w-5" />
                    {hasNewNotifications && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"
                      />
                    )}
                  </motion.div>
                </Link>
                <Link to="/admin" className="text-cute-charcoal">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <span className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded-full font-bold">
                      Admin
                    </span>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Toggle Button - Always visible */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-cute-charcoal hover:bg-cute-baby-pink hover:bg-opacity-50 focus:outline-none transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation with Grid Layout */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white bg-opacity-95 backdrop-blur-sm border-t border-pink-200 max-h-[80vh] overflow-y-auto"
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Navigation Links Grid */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-cute-charcoal opacity-70 font-poppins mb-3 px-2">
                  NAVIGATION
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                          isActive(link.path)
                            ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                            : 'bg-pink-50 text-cute-charcoal hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 hover:text-white'
                        }`}
                      >
                        <IconComponent className="h-6 w-6 mb-2" />
                        <span className="text-xs font-medium font-poppins text-center">{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Section Grid */}
              {user && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-cute-charcoal opacity-70 font-poppins mb-3 px-2">
                    MY ACCOUNT
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {userLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 relative ${
                            isActive(link.path)
                              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
                              : 'bg-pink-50 text-cute-charcoal hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 hover:text-white'
                          }`}
                        >
                          <IconComponent className="h-6 w-6 mb-2" />
                          <span className="text-xs font-medium font-poppins text-center">{link.name}</span>
                          {link.hasNotification && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </Link>
                      );
                    })}
                    
                    {/* Admin Panel Grid Item */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center mb-2">
                          <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            A
                          </span>
                        </span>
                        <span className="text-xs font-medium font-poppins text-center">Admin</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Sign In Button for non-logged in users */}
              {!user && (
                <div className="mt-6">
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};