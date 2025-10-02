import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user, token } = useAuth();

  // Create stable references for authentication state
  const isUserAuthenticated = useMemo(() => isAuthenticated(), [token]);
  const userId = useMemo(() => user?.id, [user]);

  // Load cart on component mount and when authentication changes
  useEffect(() => {
    if (isUserAuthenticated && userId) {
      console.log('Authentication detected, loading cart for user:', userId);
      loadCart();
    } else {
      console.log('User not authenticated, clearing cart state...');
      // Clear cart state when not authenticated
      setCartItems([]);
      setTotalAmount(0);
      setCartCount(0);
    }
  }, [isUserAuthenticated, userId]); // Use stable references

  const loadCart = async () => {
    // Don't try to load cart if not authenticated
    if (!isAuthenticated()) {
      console.log('Cannot load cart - user not authenticated');
      setCartItems([]);
      setTotalAmount(0);
      setCartCount(0);
      return;
    }

    // Prevent multiple simultaneous cart loads
    if (loading) {
      console.log('Cart already loading, skipping...');
      return;
    }

    try {
      setLoading(true);
      console.log('Loading cart data...');
      const cart = await cartService.getCart();
      console.log('Cart data received:', cart);
      
      // Ensure cart items is always an array
      const items = Array.isArray(cart.cartItems) ? cart.cartItems : [];
      
      setCartItems(items);
      setTotalAmount(cart.totalAmount || 0);
      setCartCount(items.reduce((total, item) => total + (item.quantity || 0), 0));
      
      console.log(`Cart loaded successfully: ${items.length} items, total: ${cart.totalAmount}`);
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Don't clear cart on error - keep existing state
      // Only clear if it's an authentication error
      if (error.message && error.message.includes('auth')) {
        setCartItems([]);
        setTotalAmount(0);
        setCartCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, productType, quantity = 1) => {
    if (!isAuthenticated()) {
      throw new Error('Please log in to add items to cart');
    }

    try {
      setLoading(true);
      console.log(`Adding to cart: productId=${productId}, type=${productType}, quantity=${quantity}`);
      
      await cartService.addToCart(productId, productType, quantity);
      
      console.log('Item added successfully, reloading cart...');
      await loadCart(); // Reload cart to get updated data
      
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    if (!isAuthenticated()) {
      throw new Error('Please log in to modify your cart');
    }

    try {
      setLoading(true);
      console.log(`Updating cart item: ${cartItemId} to quantity: ${quantity}`);
      
      await cartService.updateCartItem(cartItemId, quantity);
      
      console.log('Cart item updated successfully, reloading cart...');
      await loadCart();
      
      return true;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated()) {
      throw new Error('Please log in to modify your cart');
    }

    try {
      setLoading(true);
      console.log(`Removing cart item: ${cartItemId}`);
      
      await cartService.removeFromCart(cartItemId);
      
      console.log('Cart item removed successfully, reloading cart...');
      await loadCart();
      
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      // Only call API if authenticated
      if (isAuthenticated()) {
        await cartService.clearCart();
      }
      
      // Always clear local state
      setCartItems([]);
      setTotalAmount(0);
      setCartCount(0);
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Still clear local state even if API fails
      setCartItems([]);
      setTotalAmount(0);
      setCartCount(0);
      // Don't throw error to prevent logout from failing
      return true;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    cartCount,
    totalAmount,
    loading,
    isLoading: loading, // Alias for compatibility
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart, // Expose loadCart for manual refresh
    refreshCart: loadCart // Another alias for manual refresh
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};