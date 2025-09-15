import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create mock Supabase client for development
let currentMockUser = null;
let currentMockSession = null;
let authChangeCallbacks = [];

const mockSupabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (email === 'admin@arpozan.com' && password === 'admin123') {
        currentMockUser = {
          id: 'demo-user-id',
          email: 'admin@arpozan.com',
          email_confirmed_at: new Date().toISOString()
        };
        currentMockSession = { 
          access_token: 'demo-token',
          user: currentMockUser
        };
        
        // Notify auth state change callbacks
        authChangeCallbacks.forEach(callback => {
          setTimeout(() => callback('SIGNED_IN', currentMockSession), 10);
        });
        
        return {
          data: {
            user: currentMockUser,
            session: currentMockSession
          },
          error: null
        };
      }
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      };
    },
    signOut: async () => {
      currentMockUser = null;
      currentMockSession = null;
      
      // Notify auth state change callbacks
      authChangeCallbacks.forEach(callback => {
        setTimeout(() => callback('SIGNED_OUT', null), 10);
      });
      
      return { error: null };
    },
    getUser: async () => ({ 
      data: { user: currentMockUser }, 
      error: null 
    }),
    onAuthStateChange: (callback) => {
      authChangeCallbacks.push(callback);
      // Immediately call with current state
      setTimeout(() => {
        if (currentMockUser) {
          callback('SIGNED_IN', currentMockSession);
        } else {
          callback('SIGNED_OUT', null);
        }
      }, 100);
      
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {
              authChangeCallbacks = authChangeCallbacks.filter(cb => cb !== callback);
            } 
          } 
        } 
      };
    }
  },
  from: () => ({
    select: () => ({
      eq: () => ({ data: [], error: null }),
      range: () => ({ data: [], error: null, count: 0 }),
      order: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null })
    }),
    insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: () => ({ error: null }) })
  })
};

// Initialize Supabase
let supabase = mockSupabase;

// Try to create real client if credentials are valid
try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://') && supabaseUrl.length > 20) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Using real Supabase client');
  } else {
    console.warn('⚠️ Using mock Supabase client - Demo mode');
    supabase = mockSupabase;
  }
} catch (error) {
  console.warn('⚠️ Falling back to mock Supabase client');
  supabase = mockSupabase;
}

export { supabase }

// Auth helpers
export const auth = {
  signIn: async (email, password) => {
    console.log('🔐 Attempting login with:', email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log('🔐 Login result:', result);
    return result;
  },
  signOut: async () => {
    console.log('🚪 Signing out');
    const result = await supabase.auth.signOut();
    console.log('🚪 Sign out result:', result);
    return result;
  },
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Current user:', user);
    return user;
  },
  onAuthStateChange: (callback) => {
    console.log('👂 Setting up auth state listener');
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email || 'no user');
      callback(event, session);
    });
  }
};

// Database helpers
export const db = {
  getProducts: async () => {
    return await supabase.from('products').select('*');
  },
  getOrders: async () => {
    return await supabase.from('orders').select('*');
  },
  getUsers: async () => {
    return await supabase.from('users').select('*');
  }
};
