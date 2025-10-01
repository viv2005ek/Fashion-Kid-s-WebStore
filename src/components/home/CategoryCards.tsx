import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  path: string;
  color: string; // gradient classes for bg
  textColor: string;
  description: string;
}

export const CategoryCards: React.FC = () => {
  const categories: Category[] = [
    {
      name: 'New Arrivals',
      path: '/new-arrivals',
      color: 'from-pink-400 to-purple-500',
      textColor: 'text-white',
      description: 'Latest fashion trends'
    },
    {
      name: 'Best Sellers',
      path: '/shop',
      color: 'from-green-400 to-blue-500',
      textColor: 'text-white',
      description: 'Customer favorites'
    },
    {
      name: 'Sale',
      path: '/shop',
      color: 'from-red-400 to-pink-500',
      textColor: 'text-white',
      description: 'Up to 50% off'
    },
    {
      name: 'Gift',
      path: '/shop',
      color: 'from-purple-400 to-pink-500',
      textColor: 'text-white',
      description: 'Perfect gifts'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 relative overflow-hidden">
      {/* Floating shapes */} <div className="absolute inset-0 pointer-events-none"> <div className="absolute top-8 left-12 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-bounce-slow"></div> <div className="absolute top-16 right-16 w-5 h-5 bg-purple-400 rounded-full opacity-50 animate-float"></div> <div className="absolute bottom-12 left-1/3 w-4 h-4 bg-blue-400 rounded-full opacity-50 animate-float-reverse"></div> <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-300 rounded-full opacity-50 animate-pulse-slow"></div> <div className="absolute bottom-20 right-1/2 w-5 h-5 bg-purple-300 rounded-full opacity-50 animate-float"></div> <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-green-300 rounded-full opacity-50 animate-bounce-slow"></div> <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-yellow-300 rounded-full opacity-40 animate-float-reverse"></div> <div className="absolute bottom-10 left-2/3 w-5 h-5 bg-pink-300 rounded-full opacity-50 animate-pulse-slow"></div> </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.06,
                boxShadow: "0 25px 60px rgba(251, 207, 232, 0.4)"
              }}
            >
              <Link to={category.path}>
                <div className={`relative rounded-2xl p-8 flex flex-col justify-center h-52 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-r ${category.color}`}>
                  
                  {/* Shine effect overlay */}
                  <motion.div
                    className="absolute top-0 left-[-50%] w-full h-full pointer-events-none rounded-2xl bg-gradient-to-r from-white/0 via-white/40 to-white/0 -skew-x-12"
                    animate={{ x: ['-50%', '150%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  />

                  {/* Card content */}
                  <h3 className={`relative text-2xl md:text-3xl font-extrabold ${category.textColor} mb-2 font-baloo z-10`}>
                    {category.name}
                  </h3>
                  <p className={`relative ${category.textColor} opacity-90 text-sm z-10`}>
                    {category.description}
                  </p>

                  {/* Hover arrow */}
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute bottom-4 right-4 ${category.textColor} text-xl font-bold z-10`}
                  >
                    →
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
