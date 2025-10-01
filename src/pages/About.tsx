import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pt-10"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-300 to-blue-300 text-white py-16 relative overflow-hidden">
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shine pointer-events-none"></div>

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-5xl md:text-7xl font-bold font-baloo mb-4 drop-shadow-lg"
          >
            About Pastel Dream
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl font-poppins drop-shadow-md"
          >
            💕 Where dreams meet fashion
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cute-charcoal mb-6 font-baloo drop-shadow-sm">
              Our Story
            </h2>
            <p className="text-cute-charcoal opacity-80 text-lg mb-6 leading-relaxed font-poppins">
              Founded with a vision to bring softness and elegance to everyday fashion, Pastel Dream 
              emerged from a simple belief: that clothing should make you feel as beautiful as you are.
            </p>
            <p className="text-cute-charcoal opacity-80 text-lg mb-6 leading-relaxed font-poppins">
              We specialize in creating sustainable, eco-friendly fashion pieces that celebrate 
              femininity through gentle colors, flowing fabrics, and timeless designs. Every piece 
              in our collection is carefully curated to ensure it brings joy and confidence to your wardrobe.
            </p>
            <p className="text-cute-charcoal opacity-80 text-lg mb-8 leading-relaxed font-poppins">
              Based in London, England, we're committed to ethical fashion practices and believe 
              that beautiful clothing shouldn't come at the cost of our planet. Our zero-waste 
              philosophy drives us to create pieces that are both stunning and sustainable.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2 font-baloo">1000+</div>
                <div className="text-cute-charcoal font-poppins">Happy Customers</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2 font-baloo">100%</div>
                <div className="text-cute-charcoal font-poppins">Sustainable</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="About Us"
                className="w-full h-96 object-cover"
              />
            </div>
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="absolute -bottom-6 lg:-right-6 right-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl p-6 shadow-lg border-2 border-white"
            >
              <p className="text-white font-semibold text-center font-baloo">
                Sustainable<br/>Fashion ✨
              </p>
            </motion.div>
            
            {/* Floating decorative elements around image */}
            <div className="absolute -top-4 -left-4 text-3xl animate-float">🌸</div>
            <div className="absolute -top-2 -right-8 text-2xl animate-bounce-slow">💫</div>
            <div className="absolute -bottom-4 -left-8 text-xl animate-float-reverse">⭐</div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cute-charcoal mb-12 text-center font-baloo drop-shadow-sm">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-green-100"
            >
              <div className="text-5xl mb-4 animate-bounce-slow">🌺</div>
              <h3 className="text-2xl font-semibold text-cute-charcoal mb-3 font-baloo">Sustainability</h3>
              <p className="text-cute-charcoal opacity-80 font-poppins">We're committed to eco-friendly practices and zero waste production.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-yellow-100"
            >
              <div className="text-5xl mb-4 animate-pulse-slow">✨</div>
              <h3 className="text-2xl font-semibold text-cute-charcoal mb-3 font-baloo">Quality</h3>
              <p className="text-cute-charcoal opacity-80 font-poppins">Every piece is crafted with attention to detail and premium materials.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-pink-100"
            >
              <div className="text-5xl mb-4 animate-float">💕</div>
              <h3 className="text-2xl font-semibold text-cute-charcoal mb-3 font-baloo">Inclusivity</h3>
              <p className="text-cute-charcoal opacity-80 font-poppins">Fashion for every body, every style, and every dream.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};