import React from 'react';
import { Users, Target, Shield, Globe, Fish, Truck, MessageCircle, Award } from 'lucide-react';
import Footer from '../components/home/Footer';

const AboutPage = () => {
  
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Multi-Role Platform",
      description: "Connecting farm owners, shop owners, exporters, delivery persons, service providers, and industrial suppliers"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Verified Profiles",
      description: "NAQDA verification and system-recommended badges ensure trust and authenticity"
    },
    {
      icon: <Truck className="w-8 h-8 text-orange-600" />,
      title: "Smart Logistics",
      description: "Specialized live fish transportation with real-time tracking and qualified transporters"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: "Real-Time Communication",
      description: "Direct messaging system for seamless communication between stakeholders"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Fish className="w-12 h-12" />
              About AQUALINK
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transforming Sri Lanka's ornamental fish industry through intelligent digital solutions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              AQUALINK aims to transform the ornamental fish industry by creating a digital platform that 
              connects fish farm owners, buyers, exporters, delivery persons, service providers, and 
              industrial suppliers. We simplify transactions, provide data-driven insights to improve 
              efficiency, boost income, and support sustainable growth in Sri Lanka.
            </p>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Objectives</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Connect fish farmers and sellers",
              "Ensure transparency in transactions",
              "Provide reliable transport",
              "Improve business efficiency",
            ].map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white bg-opacity-10 rounded-lg"
              >
                <Award className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                <span className="text-black">{objective}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />

    </div>
  );
};

export default AboutPage;
