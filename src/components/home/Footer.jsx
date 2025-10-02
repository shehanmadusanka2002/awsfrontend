import React from 'react';
import { Fish } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {

  const navigate = useNavigate();
  return (
    <footer className="bg-gradient-to-r from-blue-900  via-blue-800 to-cyan-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <a href='/'><div className="flex items-center space-x-3 mb-6">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                AquaLink
              </h3>
            </div></a>
            <p className="text-blue-200 mb-6 max-w-md">
              Your trusted partner for premium ornamental fish. We bring the beauty of aquatic life to your home with care and expertise.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 cursor-pointer">
                <span className="text-sm font-bold">x</span>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 cursor-pointer">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-blue-200 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="/contact" className="text-blue-200 hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="/care-guide" className="text-blue-200 hover:text-white transition-colors duration-200">Care Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-300">Support</h4>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-blue-200 hover:text-white transition-colors duration-200">FAQ</a></li>
              <li><a href="/shopping-cart" className="text-blue-200 hover:text-white transition-colors duration-200">Cart</a></li>
              <li><a href="/support" className="text-blue-200 hover:text-white transition-colors duration-200">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-700 mt-8 pt-8 text-center">
          <p className="text-blue-200">
            © {new Date().getFullYear()} AquaLink - All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;