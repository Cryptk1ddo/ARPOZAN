// Orders management API
import { connectDB, Order, Product, Customer } from '../../../../lib/database';
import { authenticateAdmin, checkPermission, handleError, sendResponse, getPagination } from '../../../../lib/auth';

async function handler(req, res) {
  try {
    // Connect to database (optional check)
    await connectDB();

    if (req.method === 'GET') {
      // Get orders with pagination and filtering
      const { page, limit } = getPagination(req);
      const { status, search, sort = 'created_at', order = 'desc' } = req.query;

      const options = {
        page,
        limit,
        status,
        search,
        sort,
        order
      };

      const result = await Order.findAll(options);
      
      return sendResponse(res, {
        orders: result.orders,
        pagination: result.pagination,
        filters: {
          status,
          search,
          sort,
          order
        }
      });

    } else if (req.method === 'POST') {
      // Create new order
      const orderData = req.body;
      
      // Validate required fields
      if (!orderData.customerEmail || !orderData.items || orderData.items.length === 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Customer email and items are required'
        });
      }

      // Calculate total
      let total = 0;
      for (const item of orderData.items) {
        total += (item.price || 0) * (item.quantity || 0);
      }

      const order = new Order({
        ...orderData,
        total,
        status: orderData.status || 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedOrder = await order.save();
      
      return sendResponse(res, { order: savedOrder }, 201);

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        error: 'Method Not Allowed',
        message: `Method ${req.method} not allowed`
      });
    }

  } catch (error) {
    return handleError(error, res);
  }
}

// Apply authentication and permission checking
export default authenticateAdmin(
  checkPermission('orders.read')(handler)
);