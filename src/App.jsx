
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/home/Navbar";
import LoginForm from "./pages/Login"
import RegistrationForm from "./components/RegistrationForm";
import HomePage from "./pages/HomePage";
import OrderUI from "./pages/OrderUI";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import UserVerificationDashboard from "./components/admin/AdminDashboard";
import ShopOwnerDashboard from "./pages/dashboards/ShopOwnerDashboard";
import FarmOwnerDashboard from "./pages/dashboards/FarmOwnerDashboard";
import ExporterDashboard from "./pages/dashboards/ExporterDashboard";
import ServiceProviderDashboard from "./pages/dashboards/ServiceProviderDashboard";
import IndustrialStuffSellerDashboard from "./pages/dashboards/IndustrialStuffSellerDashboard";
import DeliveryPersonDashboard from "./pages/dashboards/DeliveryPersonDashboard";
import ProductApprove from "./components/admin/ProductApprove";
import FishAdsForm from "./components/farmowner/FishAdsForm";
import UserProfile from "./pages/UserProfile";
import AboutPage from './pages/AboutPage';
import Contact from './pages/Contact';
import QuoteAcceptance from "./components/shopowner/QuoteAcceptance";
import DeliveryQuoteRequest from "./components/shopowner/DeliveryQuoteRequest";
import OrderConfirmation from "./components/shopowner/OrderConfirmation";
import Cart from "./components/shopowner/Cart";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useCart } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Main App Content Component (to use auth hooks inside provider)
const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // "Open login" global event for nav"
  useEffect(() => {
    const f = () => setShowLogin(true);
    window.addEventListener("show-login", f);
    return () => window.removeEventListener("show-login", f);
  }, []);

  return (
    <Router>
      <AppRouter 
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
      />
    </Router>
  );
};

// Router component that uses navigation hooks
const AppRouter = ({ showLogin, setShowLogin, showProfileMenu, setShowProfileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely get cart context
  let clearCart;
  try {
    const cart = useCart();
    clearCart = cart.clearCart;
  } catch (error) {
    console.warn('Cart context not available:', error);
    clearCart = null;
  }

  // Function to determine if current route is a dashboard and get dashboard name
  const getDashboardName = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/dashboard/')) {
      const dashboardType = pathname.replace('/dashboard/', '');
      switch (dashboardType) {
        case 'shop-owner':
          return 'Shop Owner Dashboard';
        case 'Farm-Owner':
          return 'Farm Owner Dashboard';
        case 'Exporter':
          return 'Exporter Dashboard';
        case 'Service-Provider':
          return 'Service Provider Dashboard';
        case 'Industrial-Stuff-Seller':
          return 'Industrial Stuff Seller Dashboard';
        case 'Delivery-Person':
          return 'Delivery Person Dashboard';
        case 'admin':
          return 'Admin Dashboard';
        default:
          return 'Dashboard';
      }
    }
    return null;
  };

  const dashboardName = getDashboardName();

  // Handle logout navigation and cart clearing
  useEffect(() => {
    const handleLogout = async () => {
      setShowProfileMenu(false); // Close profile menu
      
      // Clear cart on logout (if available)
      if (clearCart) {
        try {
          await clearCart();
        } catch (error) {
          console.error('Failed to clear cart on logout:', error);
        }
      }
      
      navigate('/'); // Navigate to home page
    };
    
    window.addEventListener("user-logout", handleLogout);
    return () => window.removeEventListener("user-logout", handleLogout);
  }, [navigate, clearCart, setShowProfileMenu]);

  return (
    <div>
      {/* Navbar */}
      <Navbar
        dashboardName={dashboardName}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
      />

      {/* Login Modal */}
      {showLogin && (
      <LoginForm
     onClose={() => setShowLogin(false)}
      />
      )}

      {/* Main Content */}
      <main className="w-full mt-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm setShowLogin={setShowLogin} />} />
          
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard/shop-owner" element={<ShopOwnerDashboard />}/>
          <Route path="/dashboard/Farm-Owner" element={<FarmOwnerDashboard />}/>
          <Route path="/dashboard/Exporter" element={<ExporterDashboard />}/>
          <Route path="/dashboard/Exporter/blog" element={<ExporterDashboard />}/>
          <Route path="/dashboard/Exporter/blog/create" element={<ExporterDashboard />}/>
          <Route path="/dashboard/Exporter/blog/edit/:postId" element={<ExporterDashboard />}/>
          <Route path="/dashboard/Service-Provider" element={<ServiceProviderDashboard />}/>
          <Route path="/dashboard/Industrial-Stuff-Seller" element={<IndustrialStuffSellerDashboard/>}/>
          <Route path="/dashboard/Delivery-Person" element={<DeliveryPersonDashboard />}/>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/admin/verification" element={<UserVerificationDashboard />} />

          <Route path="/productaprove" element={<ProductApprove />} />

          {/* Not completed */}
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/fish-ads-form" element={<FishAdsForm />} />
          <Route path="/orderUI" element={<OrderUI />} />
         
          <Route path="/delivery-request" element={<DeliveryQuoteRequest />} />
          <Route path="/quote-acceptance" element={<QuoteAcceptance />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
