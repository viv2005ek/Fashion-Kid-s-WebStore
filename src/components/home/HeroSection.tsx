import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CloudSVG } from '../decorative/CloudSVG';
import { ButterflyLoader } from '../decorative/ButterflyLoader';
import { FlowerSVG } from '../decorative/FlowerSVG';
import {ShoppingCart} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/shop');
  };
  
  const handleNewArrivalsNow = () => {
    navigate('/new-arrivals');
  };

  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden pt-10">
      {/* Enhanced Decorative Elements */}
      <CloudSVG className="top-10 left-10 animate-float" color="#FBCFE8" size="lg" />
      <CloudSVG className="top-20 right-20 animate-float-reverse" color="#E9D5FF" size="lg" />
      <CloudSVG className="bottom-32 right-1/4 animate-float-slow" color="#DBEAFE" size="md" />
      <CloudSVG className="top-1/3 left-1/3 animate-float" color="#FCE7F3" size="sm" />
      
      <ButterflyLoader className="top-32 left-1/4 w-16 h-12 animate-float" color="#A7F3D0" />
      <ButterflyLoader className="top-16 right-1/3 w-20 h-16 animate-float-reverse" color="#FBCFE8" />
      <ButterflyLoader className="bottom-40 left-1/2 w-14 h-10 animate-float-slow" color="#FEF9C3" />
      
      <FlowerSVG className="bottom-20 left-16 animate-float-reverse" color="#A7F3D0" size="md" />
      <FlowerSVG className="top-1/2 right-10 animate-float" color="#FEF9C3" size="lg" />
      <FlowerSVG className="top-24 left-1/2 animate-float-slow" color="#FBCFE8" size="sm" />
      <FlowerSVG className="bottom-16 right-1/3 animate-float-reverse" color="#E9D5FF" size="md" />

      {/* Interactive floating elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/4 left-1/6 text-4xl text-pink-300 cursor-pointer"
        whileHover={{ scale: 1.3 }}
      >
        🌟
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1 
        }}
        className="absolute bottom-1/3 right-1/5 text-3xl text-purple-300 cursor-pointer"
        whileHover={{ scale: 1.2 }}
      >
        ✨
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
           <div className="relative inline-block mb-6">
  {/* Gradient Border Layer */}
  <div className="absolute inset-0 rounded-full bg-[length:200%_100%] animate-shimmer 
                  bg-gradient-to-r from-pink-400 via-purple-500 to-pink-300 p-[2px] pointer-events-none z-0">
    {/* Inner background with blur */}
    <div className="w-full h-full rounded-full bg-black/20 backdrop-blur-sm" ></div>
  </div>

  {/* Main Button Content */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(192, 132, 252, 0.4)"
    }}
    className="relative z-10 px-6 py-3 rounded-full flex justify-center items-center cursor-pointer"  onClick={handleNewArrivalsNow}
  >
    <span className="text-white font-semibold font-poppins text-sm tracking-wide">
      ✨ New Collection Available
    </span>
  </motion.div>
</div>


            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                type: "spring",
                bounce: 0.4
              }}
              className="text-6xl md:text-8xl font-extrabold mb-6 font-baloo leading-tight"
            >
              <motion.span
className="block bg-gradient-to-r from-pink-400 to-purple-800 bg-clip-text text-transparent drop-shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Best
              </motion.span>
              <motion.span
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] block mt-2"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.05 }}
              >
                Sellers
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-2xl font-medium mb-8 max-w-md mx-auto lg:mx-0 font-poppins leading-relaxed"
              style={{
                background: 'linear-gradient(135deg, #7E22CE 0%, #EC4899 50%, #3B82F6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)'
              }}
            >
              Discover our most loved pieces that make dreams come true ✨
            </motion.p>

           <motion.button
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 1 }}
  whileHover={{ 
    scale: 1.05, 
    boxShadow: "0 20px 40px rgba(192, 132, 252, 0.5)",
    y: -3
  }}
  whileTap={{ scale: 0.95 }}
  onClick={handleShopNow}
  className="group relative border-2 border-purple-500 text-purple-500 font-bold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-poppins overflow-hidden"
>
  {/* Background gradient on hover */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  {/* Shine effect */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
    animate={{ x: ['-100%', '200%'] }}
    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
  />

    <span className="relative flex items-center justify-center space-x-2 group-hover:text-white transition-colors duration-300">
      <span>{<ShoppingCart />}</span>
      <span>Shop Now</span>
    </span>
</motion.button>

          </motion.div>

          {/* Right Content - Enhanced Polaroid Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* First Polaroid */}
            <motion.div
              initial={{ opacity: 0, rotate: -10, y: 50 }}
              animate={{ opacity: 1, rotate: -8, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ 
                rotate: -3, 
                scale: 1.08, 
                y: -5,
                boxShadow: "0 25px 50px rgba(236, 72, 153, 0.3)"
              }}
              className="absolute top-0 left-10 bg-white p-4 rounded-2xl shadow-2xl transform -rotate-8 transition-all duration-300 border-2 border-pink-200 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden rounded-xl">
                <motion.img 
                  src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300" 
                  alt="Fashion 1" 
                  className="w-48 h-56 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p className="text-center mt-3 font-baloo text-gray-800 font-semibold text-sm">✨ New Style fits</p>
            </motion.div>

            {/* Second Polaroid */}
            <motion.div
              initial={{ opacity: 0, rotate: 10, y: 50 }}
              animate={{ opacity: 1, rotate: 12, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ 
                rotate: 8, 
                scale: 1.08, 
                y: -5,
                boxShadow: "0 25px 50px rgba(139, 92, 246, 0.3)"
              }}
              className="absolute top-20 right-0 bg-white p-4 rounded-2xl shadow-2xl transform rotate-12 transition-all duration-300 border-2 border-purple-200 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden rounded-xl">
                <motion.img 
                  src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300" 
                  alt="Fashion 2" 
                  className="w-48 h-56 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p className="text-center mt-3 font-baloo text-gray-800 font-semibold text-sm">🌸 Summer Vibes</p>
            </motion.div>

            {/* Interactive decorative elements */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-2 right-8 text-3xl text-yellow-400 cursor-pointer"
              whileHover={{ scale: 1.5 }}
            >
              ✨
            </motion.div>
            
            <motion.div
              animate={{ 
                rotate: -360,
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bottom-10 left-4 text-2xl text-pink-400 cursor-pointer"
              whileHover={{ scale: 1.3 }}
            >
              🌸
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};