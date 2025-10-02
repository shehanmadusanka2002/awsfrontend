import React from 'react';
import BannerCarousel from '../components/home/BannerCarousel';
import FishSection from '../components/home/FishSection';
import ServicesSection from '../components/home/ServicesSection';
import IndustrialSection from '../components/home/IndustrialSection';
import Footer from '../components/home/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Carousel */}
      <BannerCarousel />
      
      
      {/* Main Product Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          
          {/* Fish Section */}
          <FishSection />
          
          {/* Services Section */}
          <ServicesSection />
          
          {/* Industrial Section */}
          <IndustrialSection />
        </div>
      </div>
      
      
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
