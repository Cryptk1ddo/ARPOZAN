// JWT and authentication utilities
import jwt from 'jsonwebtoken';
import { AdminUser, Customer } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Admin authentication middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin || admin.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin account not found or inactive' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Customer authentication middleware
export const authenticateCustomer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    const customer = await Customer.findById(decoded.id).select('-password');
    if (!customer || customer.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'Customer account not found or inactive' 
      });
    }

    req.customer = customer;
    next();
  } catch (error) {
    console.error('Customer authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Permission checking middleware
export const checkPermission = (module, action) => {
  return (req, res, next) => {
    const admin = req.admin;
    
    // Super admin has all permissions
    if (admin.role === 'super_admin') {
      return next();
    }

    // Check specific permissions
    const permission = admin.permissions.find(p => p.module === module);
    if (!permission || !permission.actions.includes(action)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${module}:${action}`
      });
    }

    next();
  };
};

// Rate limiting helper
const requestCounts = new Map();
const REQUEST_LIMIT = 100; // requests per window
const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes

export const rateLimit = (req, res, next) => {
  const clientId = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, { count: 1, resetTime: now + WINDOW_SIZE });
    return next();
  }

  const clientData = requestCounts.get(clientId);
  
  if (now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + WINDOW_SIZE });
    return next();
  }

  if (clientData.count >= REQUEST_LIMIT) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.'
    });
  }

  clientData.count++;
  next();
};

// Input validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone) => {
  // Russian phone number format
  const phoneRegex = /^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
  return phoneRegex.test(phone);
};

// Error handling helper
export const handleError = (res, error, customMessage = null) => {
  console.error('API Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry error',
      field: Object.keys(error.keyPattern)[0]
    });
  }

  return res.status(500).json({
    success: false,
    message: customMessage || 'Internal server error'
  });
};

// Response helper
export const sendResponse = (res, statusCode, data, message = null) => {
  const response = {
    success: statusCode < 400,
    ...(message && { message }),
    ...(data && { data })
  };

  return res.status(statusCode).json(response);
};

// Pagination helper
export const getPagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};