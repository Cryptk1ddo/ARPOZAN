// Customers management API
import { connectDB, Customer, Order } from '../../../../lib/database';
import { authenticateAdmin, checkPermission, handleError, sendResponse, getPagination } from '../../../../lib/auth';
import { validateEmail } from '../../../../lib/security';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    return await getCustomers(req, res);
  }

  if (req.method === 'POST') {
    return await createCustomer(req, res);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function getCustomers(req, res) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      registeredAfter,
      registeredBefore,
      minOrders,
      maxOrders,
      minSpent,
      maxSpent
    } = req.query;

    const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

    // Build filter query
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    // Date range filter
    if (registeredAfter || registeredBefore) {
      filter.createdAt = {};
      if (registeredAfter) filter.createdAt.$gte = new Date(registeredAfter);
      if (registeredBefore) filter.createdAt.$lte = new Date(registeredBefore);
    }

    // Analytics filters
    if (minOrders !== undefined || maxOrders !== undefined) {
      filter['analytics.totalOrders'] = {};
      if (minOrders !== undefined) filter['analytics.totalOrders'].$gte = Number(minOrders);
      if (maxOrders !== undefined) filter['analytics.totalOrders'].$lte = Number(maxOrders);
    }

    if (minSpent !== undefined || maxSpent !== undefined) {
      filter['analytics.totalSpent'] = {};
      if (minSpent !== undefined) filter['analytics.totalSpent'].$gte = Number(minSpent);
      if (maxSpent !== undefined) filter['analytics.totalSpent'].$lte = Number(maxSpent);
    }

    // Build sort query
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get customers with pagination
    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .select('-password') // Exclude password from results
        .sort(sort)
        .limit(limitNum)
        .skip(skip)
        .lean(),
      Customer.countDocuments(filter)
    ]);

    // Get recent orders count for each customer
    const customerIds = customers.map(c => c._id);
    const recentOrders = await Order.aggregate([
      {
        $match: {
          customer: { $in: customerIds },
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$customer',
          recentOrders: { $sum: 1 },
          recentSpent: { $sum: '$total' }
        }
      }
    ]);

    // Merge recent order data with customers
    const customersWithRecent = customers.map(customer => {
      const recentData = recentOrders.find(r => r._id.toString() === customer._id.toString());
      return {
        ...customer,
        recentActivity: {
          orders: recentData?.recentOrders || 0,
          spent: recentData?.recentSpent || 0
        }
      };
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    return sendResponse(res, 200, {
      customers: customersWithRecent,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext,
        hasPrev
      }
    });

  } catch (error) {
    return handleError(res, error, 'Failed to get customers');
  }
}

async function createCustomer(req, res) {
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

    const {
      name,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      addresses,
      preferences,
      status = 'active'
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return sendResponse(res, 400, null, 'Name, email, and password are required');
    }

    if (!validateEmail(email)) {
      return sendResponse(res, 400, null, 'Invalid email format');
    }

    if (password.length < 6) {
      return sendResponse(res, 400, null, 'Password must be at least 6 characters long');
    }

    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return sendResponse(res, 400, null, 'Customer with this email already exists');
    }

    // Generate referral code
    const referralCode = `REF${Date.now().toString().slice(-8).toUpperCase()}`;

    // Create customer
    const customer = new Customer({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone?.trim(),
      password,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      addresses: addresses || [],
      preferences: {
        newsletter: true,
        sms: false,
        language: 'ru',
        currency: 'RUB',
        ...preferences
      },
      status,
      referralCode,
      analytics: {
        registrationSource: 'admin'
      }
    });

    await customer.save();

    // Return customer data without password
    const customerData = await Customer.findById(customer._id).select('-password');

    return sendResponse(res, 201, { customer: customerData }, 'Customer created successfully');

  } catch (error) {
    return handleError(res, error, 'Failed to create customer');
  }
}