import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, [token]);

  // Helper to ensure consistent role naming
  const normalizeUser = (userData) => {
    if (!userData) return null;
    let normalizedRole = userData.role;
    
    // Universal Role Normalization
    if (['provider', 'job_provider', 'partner', 'employer', 'jobprovider'].includes(userData.role?.toLowerCase())) {
      normalizedRole = 'job_provider';
    } else if (['user', 'job_seeker', 'seeker', 'jobseeker'].includes(userData.role?.toLowerCase())) {
      normalizedRole = 'job_seeker';
    } else if (userData.role?.toLowerCase() === 'admin') {
      normalizedRole = 'admin';
    }

    return {
      ...userData,
      role: normalizedRole
    };
  };

  const login = (newToken, userData) => {
    const normalizedUser = normalizeUser(userData);

    // Clear any stale session data first
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(newToken);
    setUser(normalizedUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    
    console.log("✅ Login successful. Stored role:", normalizedUser.role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const refreshUser = async () => {
    try {
      const api = (await import("../services/api")).default;
      const { data } = await api.getCurrentUser();
      updateUser(data);
      return data;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      if (error.response?.status === 401) logout();
      throw error;
    }
  };

  const updateUser = (updatedData) => {
    const normalized = normalizeUser(updatedData);
    const newUser = { ...user, ...normalized };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      login, 
      logout,
      updateUser,
      refreshUser,
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
