const API_BASE_URL = 'http://localhost:8000/api'; // Adjust based on Django URL setup

export const apiClient = {
  /**
   * Fetches customer details by ID
   * @param {string} customerId 
   */
  async getCustomer(customerId) {
    const response = await fetch(`${API_BASE_URL}/accounts/?customer_id=${customerId}`);
    if (!response.ok) throw new Error('Customer not found');
    const data = await response.json();
    return {
      id: data.customer_id,
      name: data.name,
      type: data.customer_type,
      status: data.is_active ? 'Active' : 'Inactive'
    };
  },

  /**
   * Fetches products available for a customer
   * @param {string} customerId 
   */
  async getProducts(customerId) {
    const response = await fetch(`${API_BASE_URL}/products/?customer_id=${customerId}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // Return results array from paginated response
    return data.results || [];
  },

  /**
   * Submits the cart to calculate promotions, coupons, and final invoice
   * @param {Object} payload 
   */
  async calculateInvoice(payload) {
    // Mock return to match design until invoice backend endpoint is complete
    return {
      subtotal: 109500,
      promotionDiscount: 15000,
      couponDiscount: 500,
      finalAmount: 94000
    };
  }
};
