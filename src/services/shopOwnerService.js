import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';

class ShopOwnerService {
  // Get all orders for shop owner
  async getMyOrders() {
    return apiService.get(API_ENDPOINTS.SHOP.MY_ORDERS);
  }

  // Get pending orders
  async getPendingOrders() {
    return apiService.get(API_ENDPOINTS.SHOP.PENDING_ORDERS);
  }

  // Get completed orders
  async getCompletedOrders() {
    return apiService.get(API_ENDPOINTS.SHOP.COMPLETED_ORDERS);
  }

  // Get orders in transit
  async getInTransitOrders() {
    return apiService.get(API_ENDPOINTS.SHOP.IN_TRANSIT_ORDERS);
  }

  // Get orders by status
  async getOrdersByStatus(statuses) {
    return apiService.post(API_ENDPOINTS.SHOP.ORDERS_BY_STATUS, statuses);
  }

  // Update order status
  async updateOrderStatus(orderStatusUpdate) {
    return apiService.put(API_ENDPOINTS.SHOP.UPDATE_STATUS, orderStatusUpdate);
  }

  // Confirm order
  async confirmOrder(orderId) {
    return apiService.put(API_ENDPOINTS.SHOP.CONFIRM_ORDER(orderId));
  }

  // Process order
  async processOrder(orderId) {
    return apiService.put(API_ENDPOINTS.SHOP.PROCESS_ORDER(orderId));
  }

  // Prepare order for shipping
  async prepareForShipping(orderId) {
    return apiService.put(API_ENDPOINTS.SHOP.PREPARE_SHIPPING(orderId));
  }

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    const url = `${API_ENDPOINTS.SHOP.CANCEL_ORDER(orderId)}${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`;
    return apiService.put(url);
  }

  // Get order statistics
  async getOrderStats() {
    return apiService.get(API_ENDPOINTS.SHOP.STATS);
  }

  // Get orders by date range
  async getOrdersByDateRange(startDate, endDate) {
    const url = `${API_ENDPOINTS.SHOP.ORDERS_BY_DATE}?startDate=${startDate}&endDate=${endDate}`;
    return apiService.get(url);
  }

  // Get today's orders
  async getTodayOrders() {
    return apiService.get(API_ENDPOINTS.SHOP.TODAY_ORDERS);
  }

  // Get this week's orders
  async getThisWeekOrders() {
    return apiService.get(API_ENDPOINTS.SHOP.WEEK_ORDERS);
  }

  // Get this month's orders
  async getThisMonthOrders() {
    return apiService.get(API_ENDPOINTS.SHOP.MONTH_ORDERS);
  }
}

export default new ShopOwnerService();