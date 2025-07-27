// API Configuration for StreetSource Platform
const API_CONFIG = {
  BASE_URL: `${API_BASE_URL}/api`,
  ENDPOINTS: {
    // Vendor Ingredient Usage APIs
    SET_DAILY_USAGE: '/vendors/setdailyusage',
    GET_USAGE_BY_DATE: '/vendors/usage/bydate',
    GET_USAGE_BY_MONTH: '/vendors/usage/bymonth',
    GET_USAGE_BY_RANGE: '/vendors/usage/byrange'
  }
};

// Global API utility function
async function apiCall(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const token = localStorage.getItem('streetsource_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Ingredient Usage API functions
const IngredientAPI = {
  // Set daily usage (POST)
  async setDailyUsage(entries) {
    return await apiCall(API_CONFIG.ENDPOINTS.SET_DAILY_USAGE, {
      method: 'POST',
      body: JSON.stringify({ entries })
    });
  },

  // Get usage by date (GET)
  async getUsageByDate(date) {
    const params = new URLSearchParams({ date });
    return await apiCall(`${API_CONFIG.ENDPOINTS.GET_USAGE_BY_DATE}?${params}`);
  },

  // Get usage by month (GET)
  async getUsageByMonth(month, year) {
    const params = new URLSearchParams({ month, year });
    return await apiCall(`${API_CONFIG.ENDPOINTS.GET_USAGE_BY_MONTH}?${params}`);
  },

  // Get usage by date range (GET)
  async getUsageByRange(startDate, endDate) {
    const params = new URLSearchParams({ start: startDate, end: endDate });
    return await apiCall(`${API_CONFIG.ENDPOINTS.GET_USAGE_BY_RANGE}?${params}`);
  }
};

// Utility functions
const DateUtils = {
  formatDate(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  },
  
  getCurrentDate() {
    return this.formatDate(new Date());
  },
  
  getCurrentMonth() {
    const now = new Date();
    return {
      month: String(now.getMonth() + 1).padStart(2, '0'),
      year: String(now.getFullYear())
    };
  }
};
