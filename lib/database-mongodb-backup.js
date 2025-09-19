// Database connection and configuration
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arpozan';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  tags: [String],
  images: [String],
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out_of_stock'], 
    default: 'active' 
  },
  features: [String],
  specifications: {
    weight: String,
    volume: String,
    servings: Number,
    ingredients: [String]
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  analytics: {
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    lastSold: Date
  }
}, {
  timestamps: true
});

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true },
  avatar: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  addresses: [{
    type: { type: String, enum: ['shipping', 'billing'], default: 'shipping' },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Russia' },
    isDefault: { type: Boolean, default: false }
  }],
  preferences: {
    newsletter: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    language: { type: String, default: 'ru' },
    currency: { type: String, default: 'RUB' }
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'blocked'], 
    default: 'active' 
  },
  analytics: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    lastOrderDate: Date,
    registrationSource: String,
    lifetimeValue: { type: Number, default: 0 }
  },
  loyaltyPoints: { type: Number, default: 0 },
  referralCode: String,
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
}, {
  timestamps: true
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    total: Number
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'RUB' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'cash', 'crypto'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    cardLast4: String,
    paymentDate: Date
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  tracking: {
    number: String,
    carrier: String,
    url: String,
    status: String,
    estimatedDelivery: Date
  },
  notes: String,
  timeline: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Admin User Schema
const adminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  avatar: String,
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'manager', 'support'],
    default: 'manager'
  },
  permissions: [{
    module: String, // 'products', 'orders', 'customers', 'analytics', 'settings'
    actions: [String] // 'read', 'write', 'delete', 'export'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    date: { type: Date, default: Date.now }
  }],
  settings: {
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'ru' },
    timezone: { type: String, default: 'Europe/Moscow' },
    emailNotifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Analytics Schema for storing aggregated data
const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'], 
    required: true 
  },
  metrics: {
    revenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    customers: { type: Number, default: 0 },
    newCustomers: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    topProducts: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      sales: Number,
      revenue: Number
    }],
    trafficSources: [{
      source: String,
      visits: Number,
      conversions: Number
    }],
    geographicData: [{
      country: String,
      city: String,
      orders: Number,
      revenue: Number
    }]
  }
}, {
  timestamps: true
});

// Password hashing middleware
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Methods
customerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create models
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);

export { connectDB, Product, Customer, Order, AdminUser, Analytics };