// Admin authentication API - Supabase version
import { supabaseAuth, rateLimit } from '../../../../lib/supabaseAuth';

export default async function handler(req, res) {
  // Apply rate limiting for login attempts
  await new Promise((resolve, reject) => {
    rateLimit(60 * 1000, 5)(req, res, (err) => { // 5 attempts per minute
      if (err) reject(err);
      else resolve();
    });
  });

  if (req.method === 'POST') {
    return await loginAdmin(req, res);
  }

  if (req.method === 'GET') {
    return await getCurrentAdmin(req, res);
  }

  if (req.method === 'DELETE') {
    return await logoutAdmin(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Attempt admin login
    const { user, admin, session, error } = await supabaseAuth.admin.signIn(email, password);
    
    if (error) {
      console.log('Admin login failed:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or insufficient permissions'
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        },
        admin: {
          id: admin?.id,
          role: admin?.role,
          permissions: admin?.permissions,
          last_login: admin?.last_login
        },
        session: {
          access_token: session?.access_token,
          expires_at: session?.expires_at
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

async function getCurrentAdmin(req, res) {
  try {
    // Get current admin user
    const { user, admin, error } = await supabaseAuth.admin.getCurrentAdmin();
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        },
        admin: {
          id: admin?.id,
          role: admin?.role,
          permissions: admin?.permissions,
          last_login: admin?.last_login
        }
      }
    });

  } catch (error) {
    console.error('Get current admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

async function logoutAdmin(req, res) {
  try {
    // Sign out from Supabase
    const { error } = await supabaseAuth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to logout'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Admin logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}