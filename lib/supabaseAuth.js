// Authentication utilities for Supabase - replaces custom JWT auth
import { supabase, createAdminClient, authHelpers } from './supabase.js';
import { AdminUserModel, CustomerModel } from './supabaseModels.js';

// Authentication helper functions
export const supabaseAuth = {
  // Admin authentication
  admin: {
    // Sign in admin user
    signIn: async (email, password) => {
      try {
        const { data, error } = await authHelpers.signIn(email, password);
        
        if (error) {
          return { user: null, error: error.message };
        }

        // Check if user is admin
        const isAdmin = await authHelpers.isAdmin(data.user);
        if (!isAdmin) {
          await authHelpers.signOut();
          return { user: null, error: 'Unauthorized: Admin access required' };
        }

        // Get admin profile
        const { data: adminProfile } = await AdminUserModel.getByUserId(data.user.id);
        
        return { 
          user: data.user, 
          admin: adminProfile,
          session: data.session,
          error: null 
        };
      } catch (error) {
        return { user: null, error: error.message };
      }
    },

    // Create admin user
    createAdmin: async (email, password, adminData = {}) => {
      try {
        const adminClient = createAdminClient();
        
        // Create auth user
        const { data, error } = await adminClient.auth.admin.createUser({
          email,
          password,
          user_metadata: { role: 'admin' }
        });

        if (error) throw error;

        // Create admin profile
        const { data: adminProfile, error: profileError } = await AdminUserModel.create({
          user_id: data.user.id,
          email,
          role: 'admin',
          permissions: adminData.permissions || ['read', 'write', 'delete'],
          ...adminData
        });

        if (profileError) {
          // Cleanup auth user if profile creation fails
          await adminClient.auth.admin.deleteUser(data.user.id);
          throw profileError;
        }

        return { admin: adminProfile, user: data.user, error: null };
      } catch (error) {
        return { admin: null, user: null, error: error.message };
      }
    },

    // Get current admin user
    getCurrentAdmin: async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        
        if (error || !user) {
          return { admin: null, user: null, error: 'Not authenticated' };
        }

        const isAdmin = await authHelpers.isAdmin(user);
        if (!isAdmin) {
          return { admin: null, user: null, error: 'Not an admin user' };
        }

        const { data: adminProfile } = await AdminUserModel.getByUserId(user.id);
        
        return { admin: adminProfile, user, error: null };
      } catch (error) {
        return { admin: null, user: null, error: error.message };
      }
    }
  },

  // Customer authentication
  customer: {
    // Sign up new customer
    signUp: async (email, password, customerData = {}) => {
      try {
        const { data, error } = await authHelpers.signUp(email, password, {
          role: 'customer',
          ...customerData
        });

        if (error) throw error;

        // Create customer profile
        const { data: customerProfile, error: profileError } = await CustomerModel.create({
          user_id: data.user.id,
          email,
          first_name: customerData.firstName || '',
          last_name: customerData.lastName || '',
          phone: customerData.phone || '',
          ...customerData
        });

        if (profileError) {
          console.error('Failed to create customer profile:', profileError);
          // Don't throw here, user auth was successful
        }

        return { 
          user: data.user, 
          customer: customerProfile,
          session: data.session,
          error: null 
        };
      } catch (error) {
        return { user: null, customer: null, error: error.message };
      }
    },

    // Sign in customer
    signIn: async (email, password) => {
      try {
        const { data, error } = await authHelpers.signIn(email, password);
        
        if (error) throw error;

        // Get customer profile
        const { data: customerProfile } = await CustomerModel.getByUserId(data.user.id);
        
        return { 
          user: data.user, 
          customer: customerProfile,
          session: data.session,
          error: null 
        };
      } catch (error) {
        return { user: null, customer: null, error: error.message };
      }
    },

    // Get current customer
    getCurrentCustomer: async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        
        if (error || !user) {
          return { customer: null, user: null, error: 'Not authenticated' };
        }

        const { data: customerProfile } = await CustomerModel.getByUserId(user.id);
        
        return { customer: customerProfile, user, error: null };
      } catch (error) {
        return { customer: null, user: null, error: error.message };
      }
    },

    // Update customer profile
    updateProfile: async (updates) => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        
        if (error || !user) {
          throw new Error('Not authenticated');
        }

        const { data: customer } = await CustomerModel.getByUserId(user.id);
        if (!customer) {
          throw new Error('Customer profile not found');
        }

        const { data: updatedCustomer, error: updateError } = await CustomerModel.update(
          customer.id, 
          updates
        );

        if (updateError) throw updateError;

        return { customer: updatedCustomer, error: null };
      } catch (error) {
        return { customer: null, error: error.message };
      }
    }
  },

  // Common authentication functions
  // Sign out (works for both admin and customer)
  signOut: async () => {
    try {
      const { error } = await authHelpers.signOut();
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get current user (without role checking)
  getCurrentUser: async () => {
    try {
      const { user, error } = await authHelpers.getCurrentUser();
      return { user, error };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return authHelpers.onAuthStateChange(callback);
  },

  // Middleware for API routes
  middleware: {
    // Require authentication
    requireAuth: async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }

        // Use admin client to verify JWT token
        const adminClient = createAdminClient();
        adminClient.auth.setAuth(token);
        const { data: { user }, error } = await adminClient.auth.getUser();
        
        if (error || !user) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
    },

    // Require admin role
    requireAdmin: async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }

        // Use admin client to verify JWT token
        const adminClient = createAdminClient();
        adminClient.auth.setAuth(token);
        const { data: { user }, error } = await adminClient.auth.getUser();
        
        if (error || !user) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        const isAdmin = await authHelpers.isAdmin(user);
        if (!isAdmin) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        req.user = user;
        const { data: adminProfile } = await AdminUserModel.getByUserId(user.id);
        req.admin = adminProfile;
        
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
    },

    // Optional authentication (for public endpoints that can be enhanced with user data)
    optionalAuth: async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (token) {
          // Use admin client to verify JWT token
          const adminClient = createAdminClient();
          adminClient.auth.setAuth(token);
          const { data: { user }, error } = await adminClient.auth.getUser();
          if (!error && user) {
            req.user = user;
          }
        }
        
        next();
      } catch (error) {
        // Continue without authentication
        next();
      }
    }
  }
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitStore = new Map();

export const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, []);
    }
    
    const requests = rateLimitStore.get(ip);
    const recentRequests = requests.filter(time => time > windowStart);
    
    if (recentRequests.length >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    recentRequests.push(now);
    rateLimitStore.set(ip, recentRequests);
    
    next();
  };
};

export default supabaseAuth;