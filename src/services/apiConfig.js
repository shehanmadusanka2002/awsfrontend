// API Configuration
export const API_BASE_URL = 'http://54.173.35.19:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Shop Owner Endpoints
  SHOP: {
    MY_ORDERS: '/shop/my-orders',
    PENDING_ORDERS: '/shop/pending-orders',
    COMPLETED_ORDERS: '/shop/completed-orders',
    IN_TRANSIT_ORDERS: '/shop/in-transit-orders',
    UPDATE_STATUS: '/shop/update-status',
    CONFIRM_ORDER: (orderId) => `/shop/confirm/${orderId}`,
    PROCESS_ORDER: (orderId) => `/shop/process/${orderId}`,
    PREPARE_SHIPPING: (orderId) => `/shop/prepare-shipping/${orderId}`,
    CANCEL_ORDER: (orderId) => `/shop/cancel/${orderId}`,
    STATS: '/shop/stats',
    ORDERS_BY_DATE: '/shop/orders/date-range',
    TODAY_ORDERS: '/shop/orders/today',
    WEEK_ORDERS: '/shop/orders/this-week',
    MONTH_ORDERS: '/shop/orders/this-month'
  },
  
  // Delivery Person Endpoints
  DELIVERY: {
    MY_ORDERS: '/delivery/my-orders',
    PENDING_DELIVERIES: '/delivery/pending',
    ORDERS_BY_STATUS: (status) => `/delivery/orders/status/${status}`,
    UPDATE_STATUS: '/delivery/update-status',
    COMPLETE_DELIVERY: (orderId) => `/delivery/complete/${orderId}`,
    START_DELIVERY: (orderId) => `/delivery/start/${orderId}`,
    PICKUP_ORDER: (orderId) => `/delivery/pickup/${orderId}`,
    STATS: '/delivery/stats',
    // Coverage Area Management
    COVERAGE_AREA_MANAGEMENT: '/delivery/coverage-area-management',
    AVAILABILITY_STATUS: '/delivery/availability-status'
  },

  // Delivery Quote Endpoints
  DELIVERY_QUOTES: {
    REQUEST: '/delivery-quotes/request',
    AVAILABLE: '/delivery-quotes/available',
    CREATE: '/delivery-quotes/create',
    QUOTES_FOR_REQUEST: (sessionId) => `/delivery-quotes/request/${sessionId}/quotes`,
    ACCEPT: (quoteId) => `/delivery-quotes/accept/${quoteId}`,
    MY_REQUESTS: '/delivery-quotes/my-requests',
    MY_QUOTES: '/delivery-quotes/my-quotes',
    REQUEST_DETAILS: (sessionId) => `/delivery-quotes/request/${sessionId}`
  },
  
  // Cart Endpoints
  CART: {
    GET_CART: '/cart',
    ADD_TO_CART: '/cart/add',
    UPDATE_CART: '/cart/update',
    REMOVE_FROM_CART: '/cart/remove',
    CLEAR_CART: '/cart/clear'
  },
  
  // Order Endpoints
  ORDERS: {
    CREATE_ORDER: '/orders',
    GET_ORDER: (orderId) => `/orders/${orderId}`,
    USER_ORDERS: '/orders/user'
  },
  
  // Product Endpoints
  PRODUCTS: {
    FISH: '/fish',
    INDUSTRIAL: '/industrial',
    FISH_DETAILS: (id) => `/fish/${id}`,
    INDUSTRIAL_DETAILS: (id) => `/industrial/${id}`
  }
};

export default API_ENDPOINTS;