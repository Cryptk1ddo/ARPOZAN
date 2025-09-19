// Customer authentication API using Supabase
import { CustomerModel } from '../../../lib/database';
import { supabaseAuth } from '../../../lib/auth';
import { sendResponse } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action } = req.query;
    
    if (action === 'login') {
      return await loginCustomer(req, res);
    }
    
    if (action === 'register') {
      return await registerCustomer(req, res);
    }
    
    if (action === 'logout') {
      return await logoutCustomer(req, res);
    }
  }

  if (req.method === 'GET') {
    const { action } = req.query;
    
    if (action === 'me') {
      return await getCurrentCustomer(req, res);
    }
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function loginCustomer(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return sendResponse(res, 400, null, 'Email and password are required');
    }

    // Use Supabase auth for customer login
    const { user, session, error } = await supabaseAuth.loginCustomer(email, password);
    
    if (error) {
      return sendResponse(res, 401, null, error.message || 'Invalid credentials');
    }

    // Get customer data from our database
    const customer = await CustomerModel.getByEmail(email);
    
    if (!customer) {
      return sendResponse(res, 404, null, 'Customer not found');
    }

    // Update last login
    await CustomerModel.updateLastLogin(customer.id);

    return sendResponse(res, 200, {
      user,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        tier: customer.tier,
        totalSpent: customer.total_spent,
        lastLogin: new Date().toISOString()
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at
      }
    }, 'Login successful');

  } catch (error) {
    console.error('Customer login error:', error);
    return sendResponse(res, 500, null, 'Login failed');
  }
}

async function registerCustomer(req, res) {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return sendResponse(res, 400, null, 'Email, password, first name, and last name are required');
    }

    // Check if customer already exists
    const existingCustomer = await CustomerModel.getByEmail(email);
    if (existingCustomer) {
      return sendResponse(res, 409, null, 'Customer already exists');
    }

    // Register with Supabase Auth
    const { user, session, error } = await supabaseAuth.registerCustomer(email, password);
    
    if (error) {
      return sendResponse(res, 400, null, error.message || 'Registration failed');
    }

    // Create customer record in our database
    const customerData = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      auth_user_id: user.id, // Link to Supabase auth user
      tier: 'Bronze',
      total_spent: 0,
      total_orders: 0,
      is_active: true
    };

    const customer = await CustomerModel.create(customerData);

    return sendResponse(res, 201, {
      user,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        tier: customer.tier,
        totalSpent: customer.total_spent
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at
      }
    }, 'Registration successful');

  } catch (error) {
    console.error('Customer registration error:', error);
    return sendResponse(res, 500, null, 'Registration failed');
  }
}

async function logoutCustomer(req, res) {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, 401, null, 'No authorization header');
    }

    // Logout from Supabase
    const { error } = await supabaseAuth.logoutCustomer(authHeader.replace('Bearer ', ''));
    
    if (error) {
      console.error('Logout error:', error);
    }

    return sendResponse(res, 200, null, 'Logout successful');

  } catch (error) {
    console.error('Customer logout error:', error);
    return sendResponse(res, 500, null, 'Logout failed');
  }
}

async function getCurrentCustomer(req, res) {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, 401, null, 'No authorization header');
    }

    // Verify token and get user
    const { user, error } = await supabaseAuth.getCurrentCustomer(authHeader.replace('Bearer ', ''));
    
    if (error || !user) {
      return sendResponse(res, 401, null, 'Invalid or expired token');
    }

    // Get customer data
    const customer = await CustomerModel.getByAuthUserId(user.id);
    
    if (!customer) {
      return sendResponse(res, 404, null, 'Customer not found');
    }

    return sendResponse(res, 200, {
      user,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        tier: customer.tier,
        totalSpent: customer.total_spent,
        totalOrders: customer.total_orders,
        lastLogin: customer.last_login
      }
    });

  } catch (error) {
    console.error('Get current customer error:', error);
    return sendResponse(res, 500, null, 'Failed to get customer data');
  }
}