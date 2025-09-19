// Individual order management API
import { connectDB, Order } from '../../../../lib/database';
import { authenticateAdmin, checkPermission, handleError, sendResponse } from '../../../../lib/auth';

async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Order ID is required'
      });
    }

    await connectDB();

    if (req.method === 'GET') {
      // Get specific order
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Order not found'
        });
      }

      return sendResponse(res, { order });

    } else if (req.method === 'PUT') {
      // Update order
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Order not found'
        });
      }

      // Update order properties
      Object.assign(order, req.body);
      order.updatedAt = new Date();

      const updatedOrder = await order.save();
      
      return sendResponse(res, { order: updatedOrder });

    } else if (req.method === 'DELETE') {
      // Delete order
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Order not found'
        });
      }

      const deleted = await order.delete();
      
      if (!deleted) {
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to delete order'
        });
      }

      return sendResponse(res, { message: 'Order deleted successfully' });

    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        error: 'Method Not Allowed',
        message: `Method ${req.method} not allowed`
      });
    }

  } catch (error) {
    return handleError(error, res);
  }
}

export default authenticateAdmin(
  checkPermission('orders.write')(handler)
);