// API endpoint to create admin users
// POST /api/admin/auth/create-admin
import { supabase, createAdminClient } from '../../../../lib/supabase';
import { AdminUserModel } from '../../../../lib/supabaseModels';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract admin data from request body
    const {
      email,
      password,
      role = 'admin',
      permissions = ['read', 'write', 'delete'],
      firstName,
      lastName
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    console.log(`Creating admin user: ${email}`);

    // Use admin client to create auth user
    const adminClient = createAdminClient();

    // Step 1: Create the auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin',
        first_name: firstName,
        last_name: lastName
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return res.status(500).json({
        error: 'Failed to create auth user',
        details: authError.message
      });
    }

    // Step 2: Create the admin profile
    const adminProfileData = {
      user_id: authData.user.id,
      email,
      role,
      permissions: Array.isArray(permissions) ? permissions : permissions.split(',').map(p => p.trim()),
      is_active: true
    };

    const { data: adminData, error: adminError } = await AdminUserModel.create(adminProfileData);

    if (adminError) {
      console.error('Admin profile creation error:', adminError);
      // Clean up the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        error: 'Failed to create admin profile',
        details: adminError.message
      });
    }

    // Return success response (without sensitive data)
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: adminData.id,
        email: adminData.email,
        role: adminData.role,
        permissions: adminData.permissions,
        is_active: adminData.is_active,
        created_at: adminData.created_at
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}