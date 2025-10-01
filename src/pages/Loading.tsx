import React from 'react';
import { motion } from 'framer-motion';

export const Loading: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center z-50"
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-20 w-6 h-6 bg-pink-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1 
          }}
          className="absolute top-32 left-32 w-4 h-4 bg-purple-400 rounded-full opacity-50"
        />

        {/* Top-right elements */}
        <motion.div
          animate={{ 
            x: [0, 15, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-24 right-24 w-5 h-5 bg-blue-400 rounded-full opacity-70"
        />
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-40 right-40 w-3 h-3 bg-pink-300 rounded-full opacity-60"
        />

        {/* Bottom elements */}
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-32 left-1/4 w-6 h-2 bg-purple-300 rounded opacity-60"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2 
          }}
          className="absolute bottom-40 right-1/3 w-4 h-4 bg-pink-400 rounded-full opacity-70"
        />
      </div>

      {/* Main loading content */}
      <div className="text-center relative z-10">
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
          className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl"
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
            className="text-3xl text-white"
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Loading text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold font-baloo mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
        >
          Pastel Dream
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-600 font-poppins mb-8 text-lg"
        >
          Loading dreamy content...
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
              className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            />
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
          className="mt-8 h-2 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mx-auto max-w-xs shadow-inner"
        />
      </div>

      {/* Shine overlay */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
      />
    </motion.div>
  );
};