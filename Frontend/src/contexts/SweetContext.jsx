/**
 * Sweet Context
 * Manages sweet inventory state and operations
 */

import { createContext, useContext, useState } from "react";
import apiService from "../services/api";

const SweetContext = createContext();

export const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all sweets from the API
   */
  const fetchSweets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getSweets();
      if (response.success) {
        setSweets(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.error || "Failed to fetch sweets");
        setSweets([]);
      }
    } catch (error) {
      console.error("Error fetching sweets:", error);
      setError("Failed to fetch sweets. Please try again.");
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new sweet
   * @param {Object} sweetData - Sweet data to add
   * @returns {Object} Success status and error if any
   */
  const addSweet = async (sweetData) => {
    try {
      const response = await apiService.addSweet(sweetData);
      if (response.success) {
        setSweets((prev) => [...prev, response.data]);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Failed to add sweet",
        };
      }
    } catch (error) {
      console.error("Error adding sweet:", error);
      return {
        success: false,
        error: error.message || "Failed to add sweet",
      };
    }
  };

  /**
   * Update an existing sweet
   * @param {number} id - Sweet ID
   * @param {Object} sweetData - Updated sweet data
   * @returns {Object} Success status and error if any
   */
  const updateSweet = async (id, sweetData) => {
    try {
      const response = await apiService.updateSweet(id, sweetData);
      if (response.success) {
        setSweets((prev) =>
          prev.map((sweet) => (sweet.id === id ? response.data : sweet))
        );
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Failed to update sweet",
        };
      }
    } catch (error) {
      console.error("Error updating sweet:", error);
      return {
        success: false,
        error: error.message || "Failed to update sweet",
      };
    }
  };

  /**
   * Delete a sweet
   * @param {number} id - Sweet ID to delete
   * @returns {Object} Success status and error if any
   */
  const deleteSweet = async (id) => {
    try {
      const response = await apiService.deleteSweet(id);
      if (response.success) {
        setSweets((prev) => prev.filter((sweet) => sweet.id !== id));
        return { success: true };
      }
      return {
        success: false,
        error: response.error || "Failed to delete sweet",
      };
    } catch (error) {
      console.error("Error deleting sweet:", error);
      return {
        success: false,
        error: error.message || "Failed to delete sweet",
      };
    }
  };

  /**
   * Purchase a sweet
   * @param {number} id - Sweet ID
   * @param {number} quantity - Quantity to purchase
   * @returns {Object} Success status, message, and error if any
   */
  const purchaseSweet = async (id, quantity) => {
    try {
      const response = await apiService.purchaseSweet(id, quantity);
      if (response.success) {
        // Update the specific sweet in state with the new data
        if (response.data) {
          setSweets((prev) =>
            prev.map((sweet) => (sweet.id === id ? response.data : sweet))
          );
        } else {
          // Fallback: refresh all sweets if no specific data returned
          await fetchSweets();
        }
        return {
          success: true,
          message: response.message || "Purchase successful!",
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to purchase sweet",
        };
      }
    } catch (error) {
      console.error("Error purchasing sweet:", error);
      return {
        success: false,
        error: error.message || "Failed to purchase sweet",
      };
    }
  };

  /**
   * Restock a sweet
   * @param {number} id - Sweet ID
   * @param {number} quantity - Quantity to add
   * @returns {Object} Success status, message, and error if any
   */
  const restockSweet = async (id, quantity) => {
    try {
      const response = await apiService.restockSweet(id, quantity);
      if (response.success) {
        // Update the specific sweet in state with the new data
        setSweets((prev) =>
          prev.map((sweet) => (sweet.id === id ? response.data : sweet))
        );
        return {
          success: true,
          message: response.message || "Restock successful!",
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to restock sweet",
        };
      }
    } catch (error) {
      console.error("Error restocking sweet:", error);
      return {
        success: false,
        error: error.message || "Failed to restock sweet",
      };
    }
  };

  /**
   * Search sweets
   * @param {string} query - Search query
   */
  const searchSweets = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.searchSweets(query);
      if (response.success) {
        setSweets(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.error || "Failed to search sweets");
        setSweets([]);
      }
    } catch (error) {
      console.error("Error searching sweets:", error);
      setError("Failed to search sweets. Please try again.");
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    sweets,
    loading,
    error,
    fetchSweets,
    addSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
    searchSweets,
    clearError,
  };

  return (
    <SweetContext.Provider value={value}>{children}</SweetContext.Provider>
  );
};

/**
 * Custom hook to use sweet context
 * @returns {Object} Sweet context value
 */
export const useSweets = () => {
  const context = useContext(SweetContext);
  if (!context) {
    throw new Error("useSweets must be used within a SweetProvider");
  }
  return context;
};
