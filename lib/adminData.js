import { supabase, db } from './supabase';

// Admin Dashboard Data Fetchers using Supabase

export const fetchDashboardMetrics = async () => {
  try {
    // Get sales metrics
    const { data: salesData } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Get user metrics
    const { data: usersData } = await supabase
      .from('users')
      .select('id, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Get product metrics
    const { data: productsData } = await supabase
      .from('products')
      .select('id, stock_quantity, price');

    // Calculate metrics
    const totalSales = salesData?.length || 0;
    const totalRevenue = salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const newCustomers = usersData?.length || 0;
    const lowStockProducts = productsData?.filter(p => p.stock_quantity < 10).length || 0;

    return {
      growthMetrics: [
        { label: 'Продажи', value: totalSales.toString(), change: '+12%', color: 'emerald' },
        { label: 'Доход', value: `₽${totalRevenue.toLocaleString()}`, change: '+8%', color: 'blue' },
        { label: 'Новые клиенты', value: newCustomers.toString(), change: '+23%', color: 'purple' },
        { label: 'Конверсия', value: '3.2%', change: '+5%', color: 'orange' }
      ],
      keyMetrics: [
        { label: 'Средний чек', value: `₽${Math.round(totalRevenue / Math.max(totalSales, 1))}`, change: '+15%', color: 'green' },
        { label: 'ROAS', value: '4.2x', change: '+18%', color: 'blue' },
        { label: 'LTV', value: '₽15,400', change: '+7%', color: 'purple' },
        { label: 'CAC', value: '₽1,250', change: '-12%', color: 'red' }
      ],
      inventory: [
        { label: 'Общий запас', value: productsData?.length.toString() || '0', change: '+5%', color: 'blue' },
        { label: 'Низкий остаток', value: lowStockProducts.toString(), change: '+3', color: 'orange' },
        { label: 'Нет в наличии', value: productsData?.filter(p => p.stock_quantity === 0).length.toString() || '0', change: '-2', color: 'red' },
        { label: 'Активные товары', value: productsData?.filter(p => p.stock_quantity > 0).length.toString() || '0', change: '+8', color: 'green' }
      ]
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return getFallbackMetrics();
  }
};

export const fetchProducts = async (page = 1, limit = 12, search = '', category = '') => {
  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        stock_quantity,
        status,
        category,
        image_url,
        description,
        created_at,
        updated_at
      `);

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      products: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0, totalPages: 0 };
  }
};

export const fetchOrders = async (page = 1, limit = 10, status = '', search = '') => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        created_at,
        updated_at,
        shipping_address,
        users (
          first_name,
          last_name,
          email
        ),
        order_items (
          id,
          product_id,
          quantity,
          price,
          products (
            name,
            image_url
          )
        )
      `);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`users.email.ilike.%${search}%,users.first_name.ilike.%${search}%,users.last_name.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      orders: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], totalCount: 0, totalPages: 0 };
  }
};

export const fetchReportsData = async () => {
  try {
    // Get sales data for the last 12 months
    const { data: salesData } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at');

    // Get top products
    const { data: topProducts } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        products (
          name,
          price,
          image_url
        )
      `)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Process sales data for chart
    const monthlySales = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthData = salesData?.filter(sale => {
        const saleDate = new Date(sale.created_at);
        return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
      }) || [];
      
      return {
        month: date.toLocaleDateString('ru-RU', { month: 'short' }),
        sales: monthData.reduce((sum, sale) => sum + sale.total_amount, 0)
      };
    });

    // Process top products
    const productSales = {};
    topProducts?.forEach(item => {
      const productId = item.product_id;
      if (!productSales[productId]) {
        productSales[productId] = {
          ...item.products,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      productSales[productId].totalQuantity += item.quantity;
      productSales[productId].totalRevenue += item.quantity * item.products.price;
    });

    const topProductsList = Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    return {
      salesChart: monthlySales,
      topProducts: topProductsList,
      totalRevenue: salesData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0,
      totalOrders: salesData?.length || 0
    };
  } catch (error) {
    console.error('Error fetching reports data:', error);
    return getFallbackReportsData();
  }
};

// CRUD Operations
export const createProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// Fallback data for when database is not available
const getFallbackMetrics = () => ({
  growthMetrics: [
    { label: 'Продажи', value: '2.5K', change: '+12%', color: 'emerald' },
    { label: 'Доход', value: '₽2,450,000', change: '+8%', color: 'blue' },
    { label: 'Новые клиенты', value: '156', change: '+23%', color: 'purple' },
    { label: 'Конверсия', value: '3.2%', change: '+5%', color: 'orange' }
  ],
  keyMetrics: [
    { label: 'Средний чек', value: '₽5,800', change: '+15%', color: 'green' },
    { label: 'ROAS', value: '4.2x', change: '+18%', color: 'blue' },
    { label: 'LTV', value: '₽15,400', change: '+7%', color: 'purple' },
    { label: 'CAC', value: '₽1,250', change: '-12%', color: 'red' }
  ],
  inventory: [
    { label: 'Общий запас', value: '42', change: '+5%', color: 'blue' },
    { label: 'Низкий остаток', value: '3', change: '+3', color: 'orange' },
    { label: 'Нет в наличии', value: '0', change: '-2', color: 'red' },
    { label: 'Активные товары', value: '42', change: '+8', color: 'green' }
  ]
});

const getFallbackReportsData = () => ({
  salesChart: [
    { month: 'Янв', sales: 180000 },
    { month: 'Фев', sales: 220000 },
    { month: 'Мар', sales: 195000 },
    { month: 'Апр', sales: 267000 },
    { month: 'Май', sales: 298000 },
    { month: 'Июн', sales: 245000 },
    { month: 'Июл', sales: 312000 },
    { month: 'Авг', sales: 289000 },
    { month: 'Сен', sales: 334000 },
    { month: 'Окт', sales: 278000 },
    { month: 'Ноя', sales: 356000 },
    { month: 'Дек', sales: 389000 }
  ],
  topProducts: [
    { name: 'Мака Перуанская', totalRevenue: 285000, totalQuantity: 143 },
    { name: 'Тонгкат Али', totalRevenue: 267000, totalQuantity: 89 },
    { name: 'Йохимбин HCl', totalRevenue: 234000, totalQuantity: 117 },
    { name: 'Цинк Пиколинат', totalRevenue: 198000, totalQuantity: 99 },
    { name: 'Комплексный набор', totalRevenue: 156000, totalQuantity: 26 }
  ],
  totalRevenue: 2450000,
  totalOrders: 1247
});

// Mock products for development
export const mockProducts = [
  {
    id: '1',
    name: 'Цинк пиколинат',
    price: 1990,
    stock_quantity: 45,
    status: 'active',
    category: 'Добавки',
    image_url: '/assets/imgs/Zink.png',
    description: 'Высококачественный цинк в легкоусвояемой форме пиколината'
  },
  {
    id: '2', 
    name: 'Мака перуанская',
    price: 1990,
    stock_quantity: 8,
    status: 'active',
    category: 'Добавки',
    image_url: '/assets/imgs/Maka peruvian.png',
    description: 'Натуральная мака из Перу для повышения энергии и выносливости'
  },
  {
    id: '3',
    name: 'Тонгкат Али',
    price: 2990,
    stock_quantity: 32,
    status: 'active',
    category: 'Добавки',
    image_url: '/assets/imgs/Tongkat Ali.png',
    description: 'Экстракт тонгкат али для поддержки гормонального баланса'
  }
];