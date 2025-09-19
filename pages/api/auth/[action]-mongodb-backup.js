// Customer authentication API
import { connectDB, Customer } from '../../../lib/database';
import { generateToken, validateEmail, validatePassword, handleError, sendResponse } from '../../../lib/auth';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { action } = req.query;
    
    if (action === 'login') {
      return await loginCustomer(req, res);
    }
    
    if (action === 'register') {
      return await registerCustomer(req, res);
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

    // Validation
    if (!email || !password) {
      return sendResponse(res, 400, null, 'Email and password are required');
    }

    if (!validateEmail(email)) {
      return sendResponse(res, 400, null, 'Invalid email format');
    }

    // Find customer
    const customer = await Customer.findOne({ 
      email: email.toLowerCase(),
      status: 'active'
    });

    if (!customer) {
      return sendResponse(res, 401, null, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await customer.comparePassword(password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, null, 'Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({
      id: customer._id,
      email: customer.email,
      type: 'customer'
    });

    // Return customer data without password
    const customerData = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      avatar: customer.avatar,
      preferences: customer.preferences,
      loyaltyPoints: customer.loyaltyPoints
    };

    return sendResponse(res, 200, {
      customer: customerData,
      token
    }, 'Login successful');

  } catch (error) {
    return handleError(res, error, 'Login failed');
  }
}

async function registerCustomer(req, res) {
  try {
    const { name, email, password, phone, referralCode } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendResponse(res, 400, null, 'Name, email, and password are required');
    }

    if (!validateEmail(email)) {
      return sendResponse(res, 400, null, 'Invalid email format');
    }

    if (!validatePassword(password)) {
      return sendResponse(res, 400, null, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return sendResponse(res, 400, null, 'Customer with this email already exists');
    }

    // Handle referral
    let referredBy = null;
    if (referralCode) {
      const referrer = await Customer.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
        // Give referral bonus
        referrer.loyaltyPoints = (referrer.loyaltyPoints || 0) + 100;
        await referrer.save();
      }
    }

    // Generate unique referral code
    const newReferralCode = `REF${Date.now().toString().slice(-8).toUpperCase()}`;

    // Create customer
    const customer = new Customer({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone?.trim(),
      password,
      referralCode: newReferralCode,
      referredBy,
      analytics: {
        registrationSource: 'website'
      },
      loyaltyPoints: referredBy ? 50 : 0 // Welcome bonus, extra if referred
    });

    await customer.save();

    // Generate JWT token
    const token = generateToken({
      id: customer._id,
      email: customer.email,
      type: 'customer'
    });

    // Return customer data without password
    const customerData = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      preferences: customer.preferences,
      loyaltyPoints: customer.loyaltyPoints,
      referralCode: customer.referralCode
    };

    return sendResponse(res, 201, {
      customer: customerData,
      token
    }, 'Registration successful');

  } catch (error) {
    return handleError(res, error, 'Registration failed');
  }
}