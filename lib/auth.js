// Authentication utilities for Supabase - replaces custom JWT auth
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-key';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Auth helper functions
export const auth = {
  // Get current user (client-side)
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      return { data: { subscription: null } };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      return { user: null, session: null, error };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Get user from server-side (for API routes)
  getUserFromRequest: async (req) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return null;

      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting user from request:', error);
      return null;
    }
  }
};

// Admin authentication middleware
export const authenticateAdmin = (handler) => {
  return async (req, res) => {
    try {
      // In development, allow all requests through
      if (process.env.NODE_ENV === 'development') {
        req.user = {
          id: 'admin-user',
          email: 'admin@arpozan.com',
          role: 'admin',
          permissions: ['*'] // All permissions
        };
        return handler(req, res);
      }

      const user = await auth.getUserFromRequest(req);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        });
      }

      // Check admin role
      const { data: userProfile, error } = await supabaseAdmin
        .from('users')
        .select('role, permissions')
        .eq('id', user.id)
        .single();

      if (error || !userProfile || userProfile.role !== 'admin') {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'Admin access required' 
        });
      }

      req.user = { ...user, ...userProfile };
      return handler(req, res);
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Authentication failed'
      });
    }
  };
};

// Permission checking middleware
export const checkPermission = (requiredPermission) => {
  return (handler) => {
    return async (req, res) => {
      try {
        if (!req.user) {
          return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'User not authenticated'
          });
        }

        // In development or if user has all permissions
        if (process.env.NODE_ENV === 'development' || 
            req.user.permissions?.includes('*')) {
          return handler(req, res);
        }

        // Check specific permission
        if (!req.user.permissions?.includes(requiredPermission)) {
          return res.status(403).json({
            error: 'Forbidden',
            message: `Permission required: ${requiredPermission}`
          });
        }

        return handler(req, res);
      } catch (error) {
        console.error('Permission check error:', error);
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Permission check failed'
        });
      }
    };
  };
};

// Error handling helper
export const handleError = (error, res) => {
  console.error('API Error:', error);
  
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal Server Error';
  
  return res.status(statusCode).json({
    error: error.name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Response helper
export const sendResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
};

// Pagination helper
export const getPagination = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Max 100 items per page
    offset
  };
};

// Legacy exports for compatibility
export const requireAuth = authenticateAdmin;
export const requireAdmin = authenticateAdmin;
export const requireAdminMock = authenticateAdmin;

// Export supabaseAuth for API routes
export const supabaseAuth = {
  loginCustomer: auth.signIn,
  registerCustomer: auth.signUp,
  logoutCustomer: auth.signOut,
  getCurrentCustomer: auth.getCurrentUser,
  admin: {
    signIn: auth.signIn,
    getCurrentAdmin: auth.getCurrentUser
  }
};

// Export verifyToken function
export const verifyToken = async (token) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const useAuth = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      loading: false,
      signIn: async () => ({ error: 'Server-side sign in not available' }),
      signOut: async () => ({ error: 'Server-side sign out not available' })
    };
  }

  return {
    user: {
      id: 'mock-user',
      email: 'user@arpozan.com',
      role: 'admin'
    },
    loading: false,
    signIn: auth.signIn,
    signOut: auth.signOut
  };
};

export default auth;