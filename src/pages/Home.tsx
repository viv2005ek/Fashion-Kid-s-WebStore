import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/home/HeroSection';
import { NewCollectionBanner } from '../components/home/NewCollectionBanner';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { FlashSaleBanner } from '../components/home/FlashSaleBanner';
import { CategoryCards } from '../components/home/CategoryCards';

export const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <NewCollectionBanner />
      <BestSellersSection />
      <FlashSaleBanner />
      <CategoryCards />
    </motion.div>
  );
};