import api from './api';

export const customerService = {
  // Get all customers with pagination and search
  async getCustomers(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
      }).toString();

      const response = await api.get(`/customers?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single customer by ID
  async getCustomer(id) {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  async createCustomer(customerData) {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing customer
  async updateCustomer(id, customerData) {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  async deleteCustomer(id) {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};