import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Fish, Users, MessageCircle, Headphones } from 'lucide-react';
import Footer from '../components/home/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    userType: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        userType: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      title: "Address",
      details: [
        "Institute of Technology",
        "University of Moratuwa",
        "Moratuwa, Sri Lanka"
      ]
    },
    {
      icon: <Mail className="w-6 h-6 text-green-600" />,
      title: "Email",
      details: [
        "info@aqualink.lk",
        "support@aqualink.lk",
        "admin@aqualink.lk"
      ]
    },
    {
      icon: <Phone className="w-6 h-6 text-purple-600" />,
      title: "Phone",
      details: [
        "+94 11 2640001",
        "+94 77 123 4567",
        "Hotline: 1919"
      ]
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 4:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  const userTypes = [
    "Farm Owner (Breeder/Grower)",
    "Shop Owner",
    "Retail Buyer",
    "Exporter",
    "Delivery Person",
    "Service Provider",
    "Industrial Stuff Seller",
    "NAQDA Officer",
    "Other"
  ];

  const supportCategories = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Account Support",
      description: "Help with registration, profile verification, and account management"
    },
    {
      icon: <Fish className="w-8 h-8 text-green-600" />,
      title: "Listing & Orders",
      description: "Assistance with fish listings, order placement, and transaction issues"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: "Platform Navigation",
      description: "Guidance on using AQUALINK features and platform functionality"
    },
    {
      icon: <Headphones className="w-8 h-8 text-orange-600" />,
      title: "Technical Support",
      description: "Help with technical issues, bugs, and platform performance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Mail className="w-12 h-12" />
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Get in touch with the AQUALINK team. We're here to help you succeed in the ornamental fish industry.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Support Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How Can We Help You?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Type
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your role</option>
                      {userTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide details about your inquiry, including any specific questions or issues you're experiencing..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{info.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Emergency Support</h3>
              <p className="text-red-100 mb-3">
                For urgent issues affecting live fish transportation or critical system failures:
              </p>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Phone className="w-5 h-5" />
                <span>Emergency Hotline: 1919</span>
              </div>
              <p className="text-red-100 text-sm mt-2">Available 24/7</p>
            </div>

            {/* NAQDA Information */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">NAQDA Verification</h3>
              <p className="text-green-100 mb-3">
                For questions about NAQDA document verification and certification:
              </p>
              <div className="space-y-1 text-sm text-green-100">
                <p>Contact your regional NAQDA office</p>
                <p>Or reach out through our platform for assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I get verified on AQUALINK?</h3>
              <p className="text-gray-600 mb-4">Upload your NAQDA documents or business permits during registration. Our verification team will review and approve within 2-3 business days.</p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What payment methods are supported?</h3>
              <p className="text-gray-600 mb-4">AQUALINK supports cash on delivery and online payment methods. More payment options will be added in future updates.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I track my fish delivery?</h3>
              <p className="text-gray-600 mb-4">Once your order is confirmed, you'll receive real-time tracking updates through the platform and notifications.</p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I cancel or modify my order?</h3>
              <p className="text-gray-600 mb-4">Orders can be modified or canceled before the seller confirms them. Contact support for assistance with specific cases.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;