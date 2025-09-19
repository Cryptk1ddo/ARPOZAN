// Admin profile and authentication status
import { connectDB, AdminUser } from '../../../lib/database';
import { authenticateAdmin, generateToken, handleError, sendResponse } from '../../../lib/auth';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    return await getProfile(req, res);
  }

  if (req.method === 'PUT') {
    return await updateProfile(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function getProfile(req, res) {
  try {
    // Apply authentication middleware
    await new Promise((resolve, reject) => {
      authenticateAdmin(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const admin = req.admin;

    // Return admin data without password
    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      avatar: admin.avatar,
      role: admin.role,
      permissions: admin.permissions,
      settings: admin.settings,
      lastLogin: admin.lastLogin,
      status: admin.status
    };

    return sendResponse(res, 200, { admin: adminData }, 'Profile retrieved successfully');

  } catch (error) {
    return handleError(res, error, 'Failed to get profile');
  }
}

async function updateProfile(req, res) {
  try {
    // Apply authentication middleware
    await new Promise((resolve, reject) => {
      authenticateAdmin(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const admin = req.admin;
    const { name, avatar, settings } = req.body;

    // Update allowed fields
    if (name) admin.name = name;
    if (avatar) admin.avatar = avatar;
    if (settings) {
      admin.settings = {
        ...admin.settings,
        ...settings
      };
    }

    await admin.save();

    // Return updated admin data
    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      avatar: admin.avatar,
      role: admin.role,
      permissions: admin.permissions,
      settings: admin.settings,
      lastLogin: admin.lastLogin
    };

    return sendResponse(res, 200, { admin: adminData }, 'Profile updated successfully');

  } catch (error) {
    return handleError(res, error, 'Failed to update profile');
  }
}