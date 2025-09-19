// Individual customer management API
import { connectDB, Customer, Order, Product } from '../../../../lib/database';
import { authenticateAdmin, checkPermission, handleError, sendResponse } from '../../../../lib/auth';
import { validateEmail } from '../../../../lib/security';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    return await getCustomer(req, res, id);
  }

  if (req.method === 'PUT') {
    return await updateCustomer(req, res, id);
  }

  if (req.method === 'DELETE') {
    return await deleteCustomer(req, res, id);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function getCustomer(req, res, id) {
  try {
    const customer = await Customer.findById(id).select('-password');

    if (!customer) {
      return sendResponse(res, 404, null, 'Customer not found');
    }

    // Get customer's orders
    const orders = await Order.find({ customer: id })
      .populate('items.product', 'name sku price')
      .sort({ createdAt: -1 })
      .limit(10) // Get last 10 orders
      .lean();

    // Get customer's favorite products (most ordered)
    const favoriteProducts = await Order.aggregate([
      { $match: { customer: customer._id } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalSpent: { $sum: '$items.total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          product: {
            _id: '$product._id',
            name: '$product.name',
            sku: '$product.sku',
            price: '$product.price',
            images: '$product.images'
          },
          totalQuantity: 1,
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    // Calculate additional analytics
    const customerAnalytics = {
      ...customer.analytics,
      orderFrequency: customer.analytics.totalOrders > 0 ? 
        Math.round((Date.now() - new Date(customer.createdAt).getTime()) / (customer.analytics.totalOrders * 24 * 60 * 60 * 1000)) : 0,
      daysSinceLastOrder: customer.analytics.lastOrderDate ? 
        Math.round((Date.now() - new Date(customer.analytics.lastOrderDate).getTime()) / (24 * 60 * 60 * 1000)) : null,
      customerSince: Math.round((Date.now() - new Date(customer.createdAt).getTime()) / (24 * 60 * 60 * 1000))
    };

    return sendResponse(res, 200, {
      customer: {
        ...customer.toObject(),
        analytics: customerAnalytics
      },
      recentOrders: orders,
      favoriteProducts
    });

  } catch (error) {
    return handleError(res, error, 'Failed to get customer');
  }
}

async function updateCustomer(req, res, id) {
  try {
    // Apply authentication and permission check
    await new Promise((resolve, reject) => {
      authenticateAdmin(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      checkPermission('customers', 'write')(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const customer = await Customer.findById(id);

    if (!customer) {
      return sendResponse(res, 404, null, 'Customer not found');
    }

    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      addresses,
      preferences,
      status,
      loyaltyPoints
    } = req.body;

    // Update fields if provided
    if (name) customer.name = name.trim();
    
    if (email && email !== customer.email) {
      if (!validateEmail(email)) {
        return sendResponse(res, 400, null, 'Invalid email format');
      }
      
      // Check if new email is already taken
      const existingCustomer = await Customer.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: id } 
      });
      if (existingCustomer) {
        return sendResponse(res, 400, null, 'Email already in use');
      }
      
      customer.email = email.toLowerCase();
    }
    
    if (phone !== undefined) customer.phone = phone?.trim();
    if (dateOfBirth) customer.dateOfBirth = new Date(dateOfBirth);
    if (gender) customer.gender = gender;
    if (addresses) customer.addresses = addresses;
    if (preferences) customer.preferences = { ...customer.preferences, ...preferences };
    if (status) customer.status = status;
    if (loyaltyPoints !== undefined) customer.loyaltyPoints = Number(loyaltyPoints);

    await customer.save();

    // Return updated customer data without password
    const updatedCustomer = await Customer.findById(customer._id).select('-password');

    return sendResponse(res, 200, { customer: updatedCustomer }, 'Customer updated successfully');

  } catch (error) {
    return handleError(res, error, 'Failed to update customer');
  }
}

async function deleteCustomer(req, res, id) {
  try {
    // Apply authentication and permission check
    await new Promise((resolve, reject) => {
      authenticateAdmin(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      checkPermission('customers', 'delete')(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const customer = await Customer.findById(id);

    if (!customer) {
      return sendResponse(res, 404, null, 'Customer not found');
    }

    // Check if customer has orders
    const orderCount = await Order.countDocuments({ customer: id });
    
    if (orderCount > 0) {
      // Soft delete - change status to inactive instead of removing
      customer.status = 'inactive';
      await customer.save();
      
      return sendResponse(res, 200, null, 'Customer deactivated successfully (has existing orders)');
    } else {
      // Hard delete if no orders
      await Customer.findByIdAndDelete(id);
      
      return sendResponse(res, 200, null, 'Customer deleted successfully');
    }

  } catch (error) {
    return handleError(res, error, 'Failed to delete customer');
  }
}