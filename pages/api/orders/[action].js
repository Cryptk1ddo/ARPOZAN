// Order placement and management API for customers
import { connectDB, Product, Customer, Order } from '../../../lib/database';
import { handleError, sendResponse, verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  await connectDB();

  const { action } = req.query;

  // All order operations require authentication
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return sendResponse(res, 401, null, 'Authentication required');
  }

  let customer;
  try {
    const decoded = verifyToken(token);
    customer = await Customer.findById(decoded.userId);
    if (!customer) {
      return sendResponse(res, 401, null, 'Invalid token');
    }
  } catch (error) {
    return sendResponse(res, 401, null, 'Invalid token');
  }

  if (req.method === 'POST' && action === 'place') {
    return await placeOrder(req, res, customer);
  }

  if (req.method === 'GET' && action === 'history') {
    return await getOrderHistory(req, res, customer);
  }

  if (req.method === 'GET' && action === 'details') {
    return await getOrderDetails(req, res, customer);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function placeOrder(req, res, customer) {
  try {
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      specialInstructions 
    } = req.body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return sendResponse(res, 400, null, 'Shipping address and payment method are required');
    }

    // Get cart with populated products
    const customerWithCart = await Customer.findById(customer._id)
      .populate('cart.product', 'name slug price originalPrice stock status')
      .lean();

    if (!customerWithCart.cart || customerWithCart.cart.length === 0) {
      return sendResponse(res, 400, null, 'Cart is empty');
    }

    // Validate cart items and stock
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of customerWithCart.cart) {
      const product = cartItem.product;
      
      if (!product || product.status !== 'active') {
        return sendResponse(res, 400, null, `Product ${product?.name || 'unknown'} is no longer available`);
      }

      if (product.stock < cartItem.quantity) {
        return sendResponse(res, 400, null, `Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity: cartItem.quantity,
        itemTotal
      });
    }

    // Calculate totals
    const shippingCost = subtotal >= 75 ? 0 : 9.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = 'ARZ' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create order
    const order = new Order({
      orderNumber,
      customer: customer._id,
      items: orderItems,
      totals: {
        subtotal,
        shipping: shippingCost,
        tax,
        total
      },
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      specialInstructions,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Update product stock and analytics
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          stock: -item.quantity,
          'analytics.sold': item.quantity,
          'analytics.revenue': item.itemTotal
        }
      });
    }

    // Clear customer cart
    customer.cart = [];
    
    // Update customer analytics
    customer.analytics.totalOrders += 1;
    customer.analytics.totalSpent += total;
    customer.lastOrderDate = new Date();

    await customer.save();

    return sendResponse(res, 201, {
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.totals.total,
        status: order.status,
        createdAt: order.createdAt
      },
      message: 'Order placed successfully'
    });

  } catch (error) {
    return handleError(res, error, 'Failed to place order');
  }
}

async function getOrderHistory(req, res, customer) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customer: customer._id })
      .select('orderNumber totals status paymentStatus createdAt items')
      .populate('items.product', 'name slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalOrders = await Order.countDocuments({ customer: customer._id });

    const enrichedOrders = orders.map(order => ({
      ...order,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      firstProductImage: order.items[0]?.product?.images?.[0] || null
    }));

    return sendResponse(res, 200, {
      orders: enrichedOrders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    return handleError(res, error, 'Failed to get order history');
  }
}

async function getOrderDetails(req, res, customer) {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return sendResponse(res, 400, null, 'Order ID is required');
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      customer: customer._id 
    })
    .populate('items.product', 'name slug images')
    .lean();

    if (!order) {
      return sendResponse(res, 404, null, 'Order not found');
    }

    // Calculate order progress
    const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = statusSteps.indexOf(order.status);
    
    const orderProgress = statusSteps.map((step, index) => ({
      step,
      label: step.charAt(0).toUpperCase() + step.slice(1),
      completed: index <= currentStepIndex,
      current: index === currentStepIndex
    }));

    return sendResponse(res, 200, {
      order: {
        ...order,
        progress: orderProgress,
        canCancel: ['pending', 'confirmed'].includes(order.status),
        estimatedDelivery: order.status === 'shipped' ? 
          new Date(order.updatedAt.getTime() + 3 * 24 * 60 * 60 * 1000) : // 3 days from shipped
          new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from order
      }
    });

  } catch (error) {
    return handleError(res, error, 'Failed to get order details');
  }
}