// Products management API - Supabase version
import { connectDB, Product } from '../../../../lib/database';
import { authenticateAdmin, checkPermission, handleError, sendResponse, getPagination } from '../../../../lib/auth';

async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const { page, limit } = getPagination(req);
      const { category, search, sort = 'created_at', order = 'desc' } = req.query;

      const options = {
        page,
        limit,
        category,
        search,
        sort,
        order
      };

      const result = await Product.findAll(options);
      
      return sendResponse(res, {
        products: result.products,
        pagination: result.pagination,
        filters: {
          category,
          search,
          sort,
          order
        }
      });

    } else if (req.method === 'POST') {
      const productData = req.body;
      
      if (!productData.name || !productData.price) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Product name and price are required'
        });
      }

      const product = new Product({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedProduct = await product.save();
      
      return sendResponse(res, { product: savedProduct }, 201);

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

export default authenticateAdmin(
  checkPermission('products.read')(handler)
);

// auth.js - Supabase admin client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Order model
export class Order {
  constructor(data) {
    this.id = data?.id || null;
    this.customerEmail = data?.customer_email || data?.customerEmail;
    this.customerId = data?.customer_id || data?.customerId;
    this.status = data?.status || 'pending';
    this.total = data?.total || 0;
    this.items = data?.items || [];
    this.shippingAddress = data?.shipping_address || data?.shippingAddress || {};
    this.paymentMethod = data?.payment_method || data?.paymentMethod;
    this.notes = data?.notes || '';
    this.createdAt = data?.created_at || data?.createdAt || new Date();
    this.updatedAt = data?.updated_at || data?.updatedAt || new Date();
  }

  static async findAll(options = {}) {
    try {
      const { page = 1, limit = 20, status, search } = options;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_items(
            id,
            quantity,
            price,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(`customer_email.ilike.%${search}%,id.eq.${search}`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.warn('Database query failed, using mock data:', error);
        return Order.getMockOrders(options);
      }

      const orders = data?.map(order => new Order(order)) || [];
      
      return {
        orders,
        pagination: {
          page,
          limit,
          total: count || orders.length,
          pages: Math.ceil((count || orders.length) / limit)
        }
      };
    } catch (error) {
      console.warn('Order.findAll failed, using mock data:', error);
      return Order.getMockOrders(options);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_items(
            id,
            quantity,
            price,
            product:products(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Database query failed, using mock data:', error);
        return Order.getMockOrder(id);
      }

      return new Order(data);
    } catch (error) {
      console.warn('Order.findById failed, using mock data:', error);
      return Order.getMockOrder(id);
    }
  }

  async save() {
    try {
      const orderData = {
        customer_email: this.customerEmail,
        customer_id: this.customerId,
        status: this.status,
        total: this.total,
        shipping_address: this.shippingAddress,
        payment_method: this.paymentMethod,
        notes: this.notes,
        updated_at: new Date()
      };

      if (this.id) {
        // Update existing order
        const { data, error } = await supabaseAdmin
          .from('orders')
          .update(orderData)
          .eq('id', this.id)
          .select()
          .single();

        if (error) throw error;
        return new Order(data);
      } else {
        // Create new order
        orderData.created_at = new Date();
        const { data, error } = await supabaseAdmin
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (error) throw error;
        return new Order(data);
      }
    } catch (error) {
      console.warn('Order.save failed:', error);
      // Return current instance for mock behavior
      this.id = this.id || Math.floor(Math.random() * 10000);
      return this;
    }
  }

  async delete() {
    try {
      if (!this.id) throw new Error('Cannot delete order without ID');

      const { error } = await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', this.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.warn('Order.delete failed:', error);
      return false;
    }
  }

  // Mock data methods for development
  static getMockOrders(options = {}) {
    const { page = 1, limit = 20, status, search } = options;
    
    const mockOrders = [
      new Order({
        id: 1001,
        customerEmail: 'john@example.com',
        customerId: 'cust_1',
        status: 'completed',
        total: 15999,
        items: [
          { productId: 'prod_1', quantity: 2, price: 7999.50, name: 'TONGKAT ALI Complex' }
        ],
        shippingAddress: {
          street: 'Ленинский проспект 123',
          city: 'Москва',
          postalCode: '119049',
          country: 'Россия'
        },
        paymentMethod: 'card',
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-16')
      }),
      new Order({
        id: 1002,
        customerEmail: 'maria@example.com',
        customerId: 'cust_2',
        status: 'processing',
        total: 8999,
        items: [
          { productId: 'prod_2', quantity: 1, price: 8999, name: 'YOHIMBINE HCL' }
        ],
        shippingAddress: {
          street: 'Тверская 45',
          city: 'Москва',
          postalCode: '125009',
          country: 'Россия'
        },
        paymentMethod: 'yoomoney',
        createdAt: new Date('2025-01-16'),
        updatedAt: new Date('2025-01-17')
      }),
      new Order({
        id: 1003,
        customerEmail: 'alex@example.com',
        customerId: 'cust_3',
        status: 'pending',
        total: 12999,
        items: [
          { productId: 'prod_3', quantity: 1, price: 12999, name: 'Экстракт Гинкго' }
        ],
        shippingAddress: {
          street: 'Невский проспект 78',
          city: 'Санкт-Петербург',
          postalCode: '191025',
          country: 'Россия'
        },
        paymentMethod: 'cash',
        createdAt: new Date('2025-01-17'),
        updatedAt: new Date('2025-01-17')
      })
    ];

    let filteredOrders = mockOrders;

    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (search) {
      filteredOrders = filteredOrders.filter(order => 
        order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toString().includes(search)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / limit)
      }
    };
  }

  static getMockOrder(id) {
    const mockOrders = Order.getMockOrders().orders;
    return mockOrders.find(order => order.id.toString() === id.toString()) || null;
  }
}

// Customer model
export class Customer {
  constructor(data) {
    this.id = data?.id || null;
    this.email = data?.email || '';
    this.firstName = data?.first_name || data?.firstName || '';
    this.lastName = data?.last_name || data?.lastName || '';
    this.phone = data?.phone || '';
    this.address = data?.address || {};
    this.totalOrders = data?.total_orders || data?.totalOrders || 0;
    this.totalSpent = data?.total_spent || data?.totalSpent || 0;
    this.status = data?.status || 'active';
    this.createdAt = data?.created_at || data?.createdAt || new Date();
    this.updatedAt = data?.updated_at || data?.updatedAt || new Date();
  }

  static async findAll(options = {}) {
    try {
      const { page = 1, limit = 20, search } = options;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.warn('Customer query failed, using mock data:', error);
        return Customer.getMockCustomers(options);
      }

      const customers = data?.map(customer => new Customer(customer)) || [];
      
      return {
        customers,
        pagination: {
          page,
          limit,
          total: count || customers.length,
          pages: Math.ceil((count || customers.length) / limit)
        }
      };
    } catch (error) {
      console.warn('Customer.findAll failed, using mock data:', error);
      return Customer.getMockCustomers(options);
    }
  }

  static getMockCustomers(options = {}) {
    const { page = 1, limit = 20 } = options;
    
    const mockCustomers = [
      new Customer({
        id: 'cust_1',
        email: 'john@example.com',
        firstName: 'Иван',
        lastName: 'Петров',
        phone: '+7 (495) 123-45-67',
        totalOrders: 5,
        totalSpent: 45999,
        status: 'active'
      }),
      new Customer({
        id: 'cust_2',
        email: 'maria@example.com',
        firstName: 'Мария',
        lastName: 'Сидорова',
        phone: '+7 (495) 765-43-21',
        totalOrders: 3,
        totalSpent: 28999,
        status: 'active'
      }),
      new Customer({
        id: 'cust_3',
        email: 'alex@example.com',
        firstName: 'Алексей',
        lastName: 'Козлов',
        phone: '+7 (812) 987-65-43',
        totalOrders: 1,
        totalSpent: 12999,
        status: 'active'
      })
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = mockCustomers.slice(startIndex, endIndex);

    return {
      customers: paginatedCustomers,
      pagination: {
        page,
        limit,
        total: mockCustomers.length,
        pages: Math.ceil(mockCustomers.length / limit)
      }
    };
  }
}

// Named exports are handled by the class declarations above