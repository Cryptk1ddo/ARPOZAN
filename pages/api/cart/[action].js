// Cart API for handling cart operations using Supabase
import { CartModel, ProductModel, CustomerModel } from '../../../lib/database';
import { supabaseAuth } from '../../../lib/auth';
import { sendResponse } from '../../../lib/auth';

export default async function handler(req, res) {
  const { action } = req.query;

  // All cart operations require authentication
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return sendResponse(res, 401, null, 'Authentication required');
  }

  let customer;
  try {
    // Verify Supabase auth token
    const { user, error } = await supabaseAuth.getCurrentCustomer(authHeader.replace('Bearer ', ''));
    
    if (error || !user) {
      return sendResponse(res, 401, null, 'Invalid or expired token');
    }

    // Get customer from our database
    customer = await CustomerModel.getByAuthUserId(user.id);
    if (!customer) {
      return sendResponse(res, 401, null, 'Customer not found');
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return sendResponse(res, 401, null, 'Authentication failed');
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
    // Get cart items with product details
    const cartItems = await CartModel.getCartItems(customer.id);
    
    // Calculate cart totals
    let subtotal = 0;
    const items = cartItems.map(item => {
      const itemTotal = item.quantity * item.price;
      subtotal += itemTotal;
      
      return {
        id: item.id,
        productId: item.product_id,
        product: {
          id: item.product_id,
          name: item.product_name,
          slug: item.product_slug,
          price: item.price,
          image: item.product_image,
          stock: item.product_stock
        },
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
        addedAt: item.created_at
      };
    });

    // Calculate shipping and tax (you can customize this logic)
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return sendResponse(res, 200, {
      items,
      summary: {
        itemCount: items.length,
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: Math.round(subtotal * 100) / 100,
        shipping: Math.round(shipping * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    return sendResponse(res, 500, null, 'Failed to get cart');
  }
}

async function addToCart(req, res, customer) {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return sendResponse(res, 400, null, 'Product ID is required');
    }

    if (quantity < 1) {
      return sendResponse(res, 400, null, 'Quantity must be at least 1');
    }

    // Check if product exists and has stock
    const product = await ProductModel.getById(productId);
    if (!product) {
      return sendResponse(res, 404, null, 'Product not found');
    }

    if (!product.is_active) {
      return sendResponse(res, 400, null, 'Product is not available');
    }

    if (product.stock_quantity < quantity) {
      return sendResponse(res, 400, null, 'Insufficient stock');
    }

    // Check if item already exists in cart
    const existingItem = await CartModel.getCartItem(customer.id, productId);
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        return sendResponse(res, 400, null, 'Insufficient stock for requested quantity');
      }
      
      await CartModel.updateQuantity(existingItem.id, newQuantity);
    } else {
      // Add new item
      await CartModel.addItem({
        customer_id: customer.id,
        product_id: productId,
        quantity,
        price: product.price
      });
    }

    // Return updated cart
    return await getCart(req, res, customer);

  } catch (error) {
    console.error('Add to cart error:', error);
    return sendResponse(res, 500, null, 'Failed to add item to cart');
  }
}

async function updateCartItem(req, res, customer) {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity < 1) {
      return sendResponse(res, 400, null, 'Item ID and valid quantity are required');
    }

    // Check if cart item exists and belongs to customer
    const cartItem = await CartModel.getById(itemId);
    if (!cartItem || cartItem.customer_id !== customer.id) {
      return sendResponse(res, 404, null, 'Cart item not found');
    }

    // Check product stock
    const product = await ProductModel.getById(cartItem.product_id);
    if (!product) {
      return sendResponse(res, 404, null, 'Product not found');
    }

    if (product.stock_quantity < quantity) {
      return sendResponse(res, 400, null, 'Insufficient stock');
    }

    // Update quantity
    await CartModel.updateQuantity(itemId, quantity);

    // Return updated cart
    return await getCart(req, res, customer);

  } catch (error) {
    console.error('Update cart item error:', error);
    return sendResponse(res, 500, null, 'Failed to update cart item');
  }
}

async function removeFromCart(req, res, customer) {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return sendResponse(res, 400, null, 'Item ID is required');
    }

    // Check if cart item exists and belongs to customer
    const cartItem = await CartModel.getById(itemId);
    if (!cartItem || cartItem.customer_id !== customer.id) {
      return sendResponse(res, 404, null, 'Cart item not found');
    }

    // Remove item
    await CartModel.removeItem(itemId);

    // Return updated cart
    return await getCart(req, res, customer);

  } catch (error) {
    console.error('Remove from cart error:', error);
    return sendResponse(res, 500, null, 'Failed to remove item from cart');
  }
}

async function clearCart(req, res, customer) {
  try {
    // Clear all items from customer's cart
    await CartModel.clearCart(customer.id);

    return sendResponse(res, 200, {
      items: [],
      summary: {
        itemCount: 0,
        totalQuantity: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
      }
    }, 'Cart cleared successfully');

  } catch (error) {
    console.error('Clear cart error:', error);
    return sendResponse(res, 500, null, 'Failed to clear cart');
  }
}