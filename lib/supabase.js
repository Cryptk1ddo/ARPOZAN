// Supabase configuration and client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export auth object for backward compatibility with expected method names
export const auth = {
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },
  
  signUp: async (email, password, options = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
  
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
  
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
  
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};

// Export auth helpers for backward compatibility
export const authHelpers = {
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },
  
  signUp: async (email, password, options = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });
    return { data, error };
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
  
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
  
  isAdmin: async (user) => {
    if (!user) return false;
    // Check if user email contains 'admin' or has admin role
    return user.email?.includes('admin') || false;
  }
};

// Admin client for server-side operations (with service role key)
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  return createClient(supabaseUrl, serviceRoleKey);
};

// Database table names (constants for consistency)
export const TABLES = {
  PRODUCTS: 'products',
  CUSTOMERS: 'customers', 
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  CART_ITEMS: 'cart_items',
  ANALYTICS: 'analytics',
  ADMIN_USERS: 'admin_users'
};

// Database helper functions
export const supabaseHelpers = {
  // Generic query helper
  async query(table, options = {}) {
    let query = supabase.from(table).select('*');
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.orderBy) {
      query = query.order(options.orderBy.field, { ascending: options.orderBy.ascending || false });
    }
    
    return query;
  },
  
  // Insert helper
  async insert(table, data) {
    return supabase.from(table).insert(data);
  },
  
  // Update helper
  async update(table, id, data) {
    return supabase.from(table).update(data).eq('id', id);
  },
  
  // Delete helper
  async delete(table, id) {
    return supabase.from(table).delete().eq('id', id);
  }
};

export default supabase;