/**
 * API Service - Centralized API communication
 * Handles all backend interactions with proper error handling
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authentication headers with JWT token
   * @returns {Object} Headers object
   */
  getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Transform backend sweet data to frontend format
   * @param {Object} sweet - Sweet data from backend
   * @returns {Object} Transformed sweet data
   */
  transformSweetFromBackend(sweet) {
    return {
      ...sweet,
      quantity: sweet.quantity_in_stock,
    };
  }

  /**
   * Transform array of sweets from backend
   * @param {Array} sweets - Array of sweet data from backend
   * @returns {Array} Transformed sweet data array
   */
  transformSweetsFromBackend(sweets) {
    if (Array.isArray(sweets)) {
      return sweets.map((sweet) => this.transformSweetFromBackend(sweet));
    }
    return sweets;
  }

  /**
   * Make a generic API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle different response types
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error:
            data.message ||
            data.detail ||
            `HTTP error! status: ${response.status}`,
          status: response.status,
        };
      }

      return {
        success: true,
        data: data,
        status: response.status,
      };
    } catch (error) {
      console.error("API Request failed:", error);
      return {
        success: false,
        error: error.message || "Network error occurred",
        status: 0,
      };
    }
  }

  async register(userData) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getSweets() {
    const response = await this.request("/sweets/");
    if (response.success && response.data) {
      response.data = this.transformSweetsFromBackend(response.data);
    }
    return response;
  }

  async addSweet(sweetData) {
    const backendData = {
      ...sweetData,
      quantity_in_stock: sweetData.quantity,
    };
    delete backendData.quantity;

    const response = await this.request("/sweets/", {
      method: "POST",
      body: JSON.stringify(backendData),
    });

    if (response.success && response.data) {
      response.data = this.transformSweetFromBackend(response.data);
    }
    return response;
  }

  async updateSweet(id, sweetData) {
    const backendData = {
      ...sweetData,
      quantity_in_stock: sweetData.quantity,
    };
    delete backendData.quantity;

    const response = await this.request(`/sweets/${id}/`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    });

    if (response.success && response.data) {
      response.data = this.transformSweetFromBackend(response.data);
    }
    return response;
  }

  async deleteSweet(id) {
    return this.request(`/sweets/${id}/`, {
      method: "DELETE",
    });
  }

  async searchSweets(query) {
    const response = await this.request(
      `/sweets/search/?q=${encodeURIComponent(query)}`
    );
    if (response.success && response.data) {
      response.data = this.transformSweetsFromBackend(response.data);
    }
    return response;
  }

  async purchaseSweet(id, quantity) {
    const response = await this.request(`/sweets/${id}/purchase/`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });

    if (response.success && response.data) {
      response.data = this.transformSweetFromBackend(response.data);
    }
    return response;
  }

  async restockSweet(id, quantity) {
    const response = await this.request(`/sweets/${id}/restock/`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });

    if (response.success && response.data) {
      response.data = this.transformSweetFromBackend(response.data);
    }
    return response;
  }
}

export default new ApiService();
