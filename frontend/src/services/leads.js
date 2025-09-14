import api from './api';

export const leadService = {
  // Get all leads with pagination and filtering
  async getLeads(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && params.status !== 'all' && { status: params.status }),
      }).toString();

      const response = await api.get(`/leads?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single lead by ID
  async getLead(id) {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new lead
  async createLead(leadData) {
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing lead
  async updateLead(id, leadData) {
    try {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete lead
  async deleteLead(id) {
    try {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Lead status options
export const LEAD_STATUSES = ['New', 'Contacted', 'Converted', 'Lost'];

// Lead status colors for badges
export const LEAD_STATUS_COLORS = {
  'New': 'status-new',
  'Contacted': 'status-contacted', 
  'Converted': 'status-converted',
  'Lost': 'status-lost'
};