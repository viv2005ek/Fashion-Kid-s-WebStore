import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-cute-charcoal relative overflow-hidden">
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
</div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-baloo mb-4 text-cute-charcoal">✨ Pastel Dream</h3>
            <p className="text-cute-charcoal opacity-80 mb-6 max-w-md font-poppins">
              Discover the softest, dreamiest fashion pieces that make you feel confident and beautiful. 
              Our pastel collection brings out your inner glow.
            </p>
            <div className="flex space-x-4">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 10 }} 
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-pink-300 to-purple-300 p-2 rounded-full shadow-lg"
              >
                <Instagram className="h-5 w-5 text-white cursor-pointer" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.2, rotate: -10 }} 
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-blue-300 to-purple-300 p-2 rounded-full shadow-lg"
              >
                <Facebook className="h-5 w-5 text-white cursor-pointer" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 10 }} 
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-blue-300 to-green-300 p-2 rounded-full shadow-lg"
              >
                <Twitter className="h-5 w-5 text-white cursor-pointer" />
              </motion.div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-baloo text-cute-charcoal">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">Shop</Link></li>
              <li><Link to="/new-arrivals" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">New Arrivals</Link></li>
              <li><Link to="/about" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">About Us</Link></li>
              <li><Link to="/contact" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-baloo text-cute-charcoal">Customer Care</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">Size Guide</a></li>
              <li><a href="#" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">Returns</a></li>
              <li><a href="#" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">Shipping Info</a></li>
              <li><a href="#" className="text-cute-charcoal opacity-80 hover:text-pink-500 hover:opacity-100 transition-all duration-300 font-poppins">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-200 mt-8 pt-8 text-center">
          <p className="text-cute-charcoal opacity-80 flex items-center justify-center font-poppins">
            © {currentYear} Pastel Dream. Made with <Heart className="h-4 w-4 mx-1 text-pink-400 animate-pulse" fill="currentColor" /> for dreamers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};