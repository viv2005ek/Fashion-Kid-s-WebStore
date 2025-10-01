import React from 'react';
import { motion } from 'framer-motion';
import {ShoppingCart} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const FlashSaleBanner: React.FC = () => {
    const navigate = useNavigate();

   const handleShopNow = () => {
    navigate('/shop');
  };
  return (
    <section className="relative bg-gradient-to-r from-pink-400 via-purple-100 to-pink-400 py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Flash Sale"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-300 to-pink-100 opacity-70"></div>
      </div>

      {/* Floating decorative elements */}
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


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="relative inline-block">
  {/* Glow / blur behind text */}
  <motion.div
    className="absolute inset-0"
    animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <h2
      className="text-6xl md:text-8xl font-extrabold mb-6 font-baloo text-white"
      style={{
        filter: 'blur(12px)',
        opacity: 0.7,
      }}
    >
       Flash Sale
    </h2>
  </motion.div>

  {/* Actual text on top */}
  <motion.h2
    className="text-6xl md:text-8xl font-extrabold mb-6 font-baloo relative"
    style={{
      background: 'linear-gradient(90deg, #F472B6, #C084FC, #F472B6)',
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: 'shimmer 2s linear infinite'
    }}
  >
     Flash Sale
  </motion.h2>
</div>

          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto font-poppins drop-shadow-md">
            Limited time offer! Grab up to <span className="font-extrabold text-yellow-300">50% OFF</span> on selected items. Hurry, while stocks last!
          </p>
       <motion.button
  whileHover={{ 
    scale: 1.1, 
    boxShadow: "0 20px 50px rgba(192, 132, 252, 0.5)",
    y: -4
  }}
  whileTap={{ scale: 0.95 }}
  className="relative group  text-white font-bold px-14 py-5 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 text-lg font-poppins"
 onClick={handleShopNow}>
  {/* Static gradient background */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl"></div>

  {/* Shine effect */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
    animate={{ x: ['-100%', '200%'] }}
    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
  />

  <span className="relative flex items-center justify-center space-x-2">
    {<ShoppingCart />}  <span> </span>Shop Now
  </span>
</motion.button>

        </motion.div>
      </div>
    </section>
  );
};
