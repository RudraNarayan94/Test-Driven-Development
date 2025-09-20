/**
 * Authentication Context
 * Manages user authentication state and operations
 */

import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login user with credentials
   * @param {Object} credentials - Username and password
   * @returns {Object} Success status and errors if any
   */
  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);

      if (response.success && response.data && response.data.access_token) {
        // Store tokens and user data
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));

        setIsLoggedIn(true);
        setUser(response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          errors: [response.error || "Login failed"],
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        errors: [error.message || "Network error. Please try again."],
      };
    }
  };

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Object} Success status and errors if any
   */
  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);

      if (response.success && response.data && response.data.access_token) {
        // Store tokens and user data
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));

        setIsLoggedIn(true);
        setUser(response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          errors: [response.error || "Registration failed"],
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        errors: [error.message || "Network error. Please try again."],
      };
    }
  };

  /**
   * Logout user and clear session data
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    setIsLoggedIn(false);
    setUser(null);
  };

  /**
   * Check if current user is admin
   * @returns {boolean} True if user is admin
   */
  const isAdmin = () => {
    return user?.is_staff || user?.is_superuser || false;
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
