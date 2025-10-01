import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {BellRing} from 'lucide-react';
export const NewCollectionBanner: React.FC = () => {
   const navigate = useNavigate();

  const handleNotifyNow = () => {
    navigate('/new-arrivals');
  };
  return (
    <section className="bg-gradient-to-r from-cute-cloud-pink via-white to-cute-cloud-purple py-16 relative overflow-hidden">
      {/* Floating decorative elements */}
     <div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-6 left-10 w-6 h-6 bg-pink-400 rounded-full opacity-80 animate-bounce-slow"></div>
  <div className="absolute top-16 right-12 w-5 h-5 bg-purple-400 rounded-full opacity-70 animate-float"></div>
  <div className="absolute top-24 left-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse-slow"></div>
  
  <div className="absolute bottom-12 left-1/3 w-5 h-5 bg-purple-400 rotate-45 clip-triangle opacity-80 animate-float-reverse"></div>
  <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-pink-500 rotate-45 clip-triangle opacity-70 animate-bounce-slow"></div>
  
  <div className="absolute top-1/3 right-1/3 w-6 h-2 bg-pink-400 rounded opacity-70 animate-float"></div>
  <div className="absolute top-2/5 right-1/2 w-3 h-3 bg-yellow-300 rounded-full opacity-80 animate-float"></div>
</div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-cute-charcoal mb-4 font-baloo drop-shadow-sm">
            New collection launching soon!
          </h2>
          <p className="text-cute-charcoal opacity-80 text-lg mb-8 max-w-2xl mx-auto font-poppins leading-relaxed">
            A sustainable, eco-friendly and zero waste brand headquartered in the City of London, England. Can't wait wait to unwrap to focus on our dreams product, collection, or blog post?
          </p>
          <motion.button
  whileHover={{ 
    scale: 1.05, 
    boxShadow: "0 10px 30px rgba(251, 207, 232, 0.4)",
    y: -2
  }}
  whileTap={{ scale: 0.95 }}
  className="group relative border-2 border-pink-400 text-pink-400 font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins overflow-hidden"
>
  {/* Background gradient on hover */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  {/* Shine effect */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
    animate={{ x: ['-100%', '200%'] }}
    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
    onClick={handleNotifyNow}
  />

  <span className="relative flex items-center justify-center group-hover:text-white transition-colors duration-300">
    {<BellRing />} <span className="pl-1"> Notify Me</span>
  </span>
</motion.button>

        </motion.div>
      </div>
    </section>
  );
};