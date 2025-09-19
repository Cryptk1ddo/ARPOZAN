import { createContext, useContext, useState, useEffect } from 'react';
import { useCustomerAuth } from './apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Use the Supabase customer auth hook from apiClient
  const supabaseAuth = useCustomerAuth();
  
  // Provide backward-compatible interface
  const value = {
    ...supabaseAuth,
    // Map Supabase auth to expected interface
    isAuthenticated: () => supabaseAuth.isAuthenticated,
    login: supabaseAuth.login,
    logout: supabaseAuth.logout,
    register: supabaseAuth.register,
    user: supabaseAuth.user || supabaseAuth.customer,
    isLoading: supabaseAuth.loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export for backward compatibility
export default AuthContext;