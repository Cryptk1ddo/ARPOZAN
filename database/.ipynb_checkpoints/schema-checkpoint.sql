-- ARPOZAN E-commerce Database Schema
-- PostgreSQL/Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- Core Tables
-- ============================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  avatar_url TEXT,
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Россия',
  member_since TIMESTAMP DEFAULT NOW(),
  loyalty_points INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  is_vip BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  slug VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  one_time_price DECIMAL(10,2) NOT NULL,
  subscription_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  category_id UUID REFERENCES categories(id),
  brand VARCHAR(100) DEFAULT 'ARPOZAN',
  weight_grams INTEGER,
  serving_size VARCHAR(50),
  servings_per_container INTEGER,
  benefits JSONB DEFAULT '[]',
  ingredients JSONB DEFAULT '[]',
  usage_instructions TEXT,
  warnings TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  slug VARCHAR(255) UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Shipping Information
  shipping_name VARCHAR(255),
  shipping_email VARCHAR(255),
  shipping_phone VARCHAR(20),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100),
  
  -- Payment Information
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  
  -- Tracking Information
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  delivered_at TIMESTAMP,
  
  -- Customer Rating
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  subscription_type VARCHAR(20) DEFAULT 'one-time',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cart Table
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  subscription_type VARCHAR(20) DEFAULT 'one-time',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id, subscription_type)
);

-- Wishlist Table
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================
-- Quiz & Recommendations
-- ============================

-- Quiz Questions Table
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL,
  options JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Responses Table
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  question_id UUID REFERENCES quiz_questions(id),
  answer_value VARCHAR(255),
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product Recommendations Table
CREATE TABLE product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  recommended_products JSONB DEFAULT '[]',
  quiz_score_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- Content Management
-- ============================

-- FAQ Table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  product_id VARCHAR(50) REFERENCES products(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id VARCHAR(50) REFERENCES products(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- User Engagement
-- ============================

-- Achievements Table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  criteria JSONB DEFAULT '{}',
  points_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 100,
  UNIQUE(user_id, achievement_id)
);

-- User Activity Log Table
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- Admin & Analytics
-- ============================

-- Admins Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB DEFAULT '[]',
  avatar_url TEXT,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Events Table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  page_url TEXT,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- Configuration
-- ============================

-- Site Settings Table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string',
  description TEXT,
  updated_by UUID REFERENCES admins(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discount Codes Table
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2) DEFAULT 0,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- Indexes for Performance
-- ============================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_loyalty_points ON users(loyalty_points DESC);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Products indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(one_time_price);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_sort_order ON products(sort_order);

-- Orders indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Order Items indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Cart indexes
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_updated ON cart(updated_at DESC);

-- Wishlist indexes
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_wishlist_product ON wishlist(product_id);

-- Analytics indexes
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_date ON analytics_events(created_at DESC);

-- User Activity indexes
CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX idx_user_activity_date ON user_activity(created_at DESC);

-- ============================
-- Row Level Security (RLS)
-- ============================

-- Enable RLS on user-specific tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Cart
CREATE POLICY "Users can manage own cart" ON cart
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Wishlist
CREATE POLICY "Users can manage own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies (bypass RLS for admins)
CREATE POLICY "Admins can manage all data" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid() AND is_active = true
    )
  );