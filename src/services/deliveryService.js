import apiService from './apiService';
import { API_ENDPOINTS } from './apiConfig';

class DeliveryService {
  // Get all assigned orders
  async getMyOrders() {
    return apiService.get(API_ENDPOINTS.DELIVERY.MY_ORDERS);
  }

  // Get pending deliveries
  async getPendingDeliveries() {
    return apiService.get(API_ENDPOINTS.DELIVERY.PENDING_DELIVERIES);
  }

  // Get orders by status
  async getOrdersByStatus(status) {
    return apiService.get(API_ENDPOINTS.DELIVERY.ORDERS_BY_STATUS(status));
  }

  // Update order status
  async updateOrderStatus(orderStatusUpdate) {
    return apiService.put(API_ENDPOINTS.DELIVERY.UPDATE_STATUS, orderStatusUpdate);
  }

  // Complete delivery
  async completeDelivery(orderId) {
    return apiService.put(API_ENDPOINTS.DELIVERY.COMPLETE_DELIVERY(orderId));
  }

  // Start delivery
  async startDelivery(orderId) {
    return apiService.put(API_ENDPOINTS.DELIVERY.START_DELIVERY(orderId));
  }

  // Pickup order
  async pickupOrder(orderId) {
    return apiService.put(API_ENDPOINTS.DELIVERY.PICKUP_ORDER(orderId));
  }

  // Get delivery statistics
  async getDeliveryStats() {
    return apiService.get(API_ENDPOINTS.DELIVERY.STATS);
  }

  // Custom status update with notes
  async updateStatusWithNotes(orderId, newStatus, notes = '') {
    return this.updateOrderStatus({
      orderId,
      newStatus,
      notes
    });
  }

  // ========== NEW QUOTE-RELATED METHODS ==========

  // Get available quote requests for delivery persons
  async getAvailableQuoteRequests() {
    return apiService.get(API_ENDPOINTS.DELIVERY_QUOTES.AVAILABLE);
  }

  // Create a delivery quote
  async createQuote(quoteData) {
    return apiService.post(API_ENDPOINTS.DELIVERY_QUOTES.CREATE, quoteData);
  }

  // Get delivery person's quotes
  async getMyQuotes() {
    return apiService.get(API_ENDPOINTS.DELIVERY_QUOTES.MY_QUOTES);
  }

  // ========== CUSTOMER/SHOP OWNER METHODS ==========

  // Create a delivery quote request
  async createQuoteRequest(requestData) {
    return apiService.post(API_ENDPOINTS.DELIVERY_QUOTES.REQUEST, requestData);
  }

  // Get quotes for a specific request
  async getQuotesForRequest(sessionId) {
    return apiService.get(API_ENDPOINTS.DELIVERY_QUOTES.QUOTES_FOR_REQUEST(sessionId));
  }

  // Accept a delivery quote
  async acceptQuote(quoteId) {
    return apiService.post(API_ENDPOINTS.DELIVERY_QUOTES.ACCEPT(quoteId));
  }

  // Get customer's quote requests
  async getMyQuoteRequests() {
    return apiService.get(API_ENDPOINTS.DELIVERY_QUOTES.MY_REQUESTS);
  }

  // Get specific quote request details
  async getQuoteRequest(sessionId) {
    return apiService.get(API_ENDPOINTS.DELIVERY_QUOTES.REQUEST_DETAILS(sessionId));
  }

  // ========== COVERAGE AREA MANAGEMENT METHODS ==========

  // Get coverage area and availability data
  async getCoverageAreaData() {
    return apiService.get(API_ENDPOINTS.DELIVERY.COVERAGE_AREA_MANAGEMENT);
  }

  // Update coverage area and availability data
  async updateCoverageAreaData(coverageData) {
    return apiService.put(API_ENDPOINTS.DELIVERY.COVERAGE_AREA_MANAGEMENT, coverageData);
  }

  // Update only availability status
  async updateAvailabilityStatus(isAvailable) {
    return apiService.put(`${API_ENDPOINTS.DELIVERY.AVAILABILITY_STATUS}?isAvailable=${isAvailable}`);
  }
}

export default new DeliveryService();