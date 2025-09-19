// Cart API for handling cart operations
import { connectDB, Product, Customer } from '../../../lib/database';
import { handleError, sendResponse, verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  await connectDB();

  const { action } = req.query;

  // All cart operations require authentication
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

  if (req.method === 'GET' && action === 'get') {
    return await getCart(req, res, customer);
  }

  if (req.method === 'POST' && action === 'add') {
    return await addToCart(req, res, customer);
  }

  if (req.method === 'PUT' && action === 'update') {
    return await updateCartItem(req, res, customer);
  }

  if (req.method === 'DELETE' && action === 'remove') {
    return await removeFromCart(req, res, customer);
  }

  if (req.method === 'DELETE' && action === 'clear') {
    return await clearCart(req, res, customer);
  }

  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}

async function getCart(req, res, customer) {
  try {
    // Populate cart items with product details
    const customerWithCart = await Customer.findById(customer._id)
      .populate('cart.product', 'name slug price originalPrice images stock status')
      .lean();

    // Filter out inactive products and calculate totals
    const activeCartItems = customerWithCart.cart.filter(item => 
      item.product && 
      item.product.status === 'active' && 
      item.product.stock > 0
    );

    // Calculate cart totals
    let subtotal = 0;
    let totalItems = 0;

    const enrichedCart = activeCartItems.map(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      return {
        _id: item._id,
        product: {
          ...item.product,
          onSale: item.product.originalPrice && item.product.originalPrice > item.product.price,
          discount: item.product.originalPrice && item.product.originalPrice > item.product.price ? 
            Math.round((1 - item.product.price / item.product.originalPrice) * 100) : 0,
        },
        quantity: item.quantity,
        itemTotal
      };
    });

    // Calculate shipping (free over $75)
    const shippingThreshold = 75;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 9.99;
    const total = subtotal + shippingCost;

    return sendResponse(res, 200, {
      cart: enrichedCart,
      summary: {
        subtotal,
        shippingCost,
        total,
        totalItems,
        freeShippingEligible: subtotal >= shippingThreshold,
        freeShippingRemaining: Math.max(0, shippingThreshold - subtotal)
      }
    });

  } catch (error) {
    return handleError(res, error, 'Failed to get cart');
  }
}

async function addToCart(req, res, customer) {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return sendResponse(res, 400, null, 'Product ID is required');
    }

    // Validate product exists and is available
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return sendResponse(res, 404, null, 'Product not found or not available');
    }

    if (product.stock < quantity) {
      return sendResponse(res, 400, null, 'Insufficient stock');
    }

    // Check if item already exists in cart
    const existingItemIndex = customer.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const newQuantity = customer.cart[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return sendResponse(res, 400, null, 'Insufficient stock for requested quantity');
      }

      customer.cart[existingItemIndex].quantity = newQuantity;
      customer.cart[existingItemIndex].addedAt = new Date();
    } else {
      // Add new item to cart
      customer.cart.push({
        product: productId,
        quantity,
        addedAt: new Date()
      });
    }

    await customer.save();

    // Increment product analytics
    await Product.findByIdAndUpdate(productId, {
      $inc: { 'analytics.addedToCart': 1 }
    });

    return sendResponse(res, 200, { 
      message: 'Product added to cart successfully',
      cartItemCount: customer.cart.length
    });

  } catch (error) {
    return handleError(res, error, 'Failed to add product to cart');
  }
}

async function updateCartItem(req, res, customer) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return sendResponse(res, 400, null, 'Invalid product ID or quantity');
    }

    // Validate product and stock
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return sendResponse(res, 404, null, 'Product not found or not available');
    }

    if (product.stock < quantity) {
      return sendResponse(res, 400, null, 'Insufficient stock');
    }

    // Find and update cart item
    const cartItemIndex = customer.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return sendResponse(res, 404, null, 'Item not found in cart');
    }

    customer.cart[cartItemIndex].quantity = quantity;
    customer.cart[cartItemIndex].addedAt = new Date();

    await customer.save();

    return sendResponse(res, 200, { 
      message: 'Cart item updated successfully' 
    });

  } catch (error) {
    return handleError(res, error, 'Failed to update cart item');
  }
}

async function removeFromCart(req, res, customer) {
  try {
    const { productId } = req.body;

    if (!productId) {
      return sendResponse(res, 400, null, 'Product ID is required');
    }

    // Remove item from cart
    customer.cart = customer.cart.filter(
      item => item.product.toString() !== productId
    );

    await customer.save();

    return sendResponse(res, 200, { 
      message: 'Item removed from cart successfully',
      cartItemCount: customer.cart.length
    });

  } catch (error) {
    return handleError(res, error, 'Failed to remove item from cart');
  }
}

async function clearCart(req, res, customer) {
  try {
    customer.cart = [];
    await customer.save();

    return sendResponse(res, 200, { 
      message: 'Cart cleared successfully' 
    });

  } catch (error) {
    return handleError(res, error, 'Failed to clear cart');
  }
}