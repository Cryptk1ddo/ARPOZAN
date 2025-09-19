# 🚀 ARPOZAN MongoDB to Supabase Migration Guide

## 📋 Overview

This guide walks you through migrating your ARPOZAN project from MongoDB to Supabase, giving you:

- **Hosted PostgreSQL** database with automatic backups
- **Built-in Authentication** with social providers
- **Real-time subscriptions** out of the box
- **Row Level Security** for data protection
- **Auto-generated APIs** with instant REST and GraphQL
- **Dashboard UI** for database management

---

## 🎯 Step 1: Setup Supabase Project

### 1.1 Create Supabase Account & Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Choose a region close to your users
4. Set a strong database password

### 1.2 Get Project Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Copy your **service_role key** (keep this secret!)

### 1.3 Setup Environment Variables
```bash
# Copy the example file
cp .env.supabase.example .env.local

# Update with your actual Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## 🗄️ Step 2: Create Database Schema

### 2.1 Run the SQL Schema
1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase-schema.sql`
4. Execute the SQL to create all tables and policies

### 2.2 Verify Tables Created
Check that these tables exist in **Database** → **Tables**:
- `products`
- `customers`
- `orders`
- `order_items`
- `cart_items`
- `admin_users`
- `analytics`

---

## 🔄 Step 3: Update Your API Routes

We've created new Supabase-compatible models. Update your API routes:

### Before (MongoDB):
```javascript
import { connectDB, Product } from '../../../lib/database.js';

export default async function handler(req, res) {
  await connectDB();
  const products = await Product.find({});
  res.json({ products });
}
```

### After (Supabase):
```javascript
import { ProductModel } from '../../../lib/supabaseModels.js';

export default async function handler(req, res) {
  const { data: products, error } = await ProductModel.getAll();
  if (error) return res.status(500).json({ error });
  res.json({ products });
}
```

### Key Changes Needed:

#### 🛍️ Products API (`pages/api/admin/products/index.js`):
```javascript
// Replace MongoDB imports
import { ProductModel } from '../../../../lib/supabaseModels.js';
import { supabaseAuth } from '../../../../lib/supabaseAuth.js';

// Replace authentication middleware
const { requireAdmin } = supabaseAuth.middleware;

// Replace database operations
const { data: products, error } = await ProductModel.getAll(filters);
```

#### 👥 Customers API (`pages/api/admin/customers/index.js`):
```javascript
import { CustomerModel } from '../../../../lib/supabaseModels.js';

// Update operations
const { data: customers, error } = await CustomerModel.getAll(filters);
```

#### 📦 Orders API (`pages/api/admin/orders/index.js`):
```javascript
import { OrderModel } from '../../../../lib/supabaseModels.js';

// Update operations  
const { data: orders, error } = await OrderModel.getAll(filters);
```

#### 📊 Analytics API (`pages/api/admin/analytics/index.js`):
```javascript
import { AnalyticsModel } from '../../../../lib/supabaseModels.js';

// Update operations
const { data: metrics, error } = await AnalyticsModel.getDashboardMetrics();
```

---

## 🔐 Step 4: Update Authentication

### 4.1 Replace Auth System
The new Supabase auth system is in `lib/supabaseAuth.js`:

#### Admin Authentication:
```javascript
import { supabaseAuth } from '../lib/supabaseAuth.js';

// Sign in admin
const { user, admin, error } = await supabaseAuth.admin.signIn(email, password);

// Create admin user
const { admin, error } = await supabaseAuth.admin.createAdmin(email, password, {
  permissions: ['read', 'write', 'delete']
});
```

#### Customer Authentication:
```javascript
// Customer sign up
const { user, customer, error } = await supabaseAuth.customer.signUp(email, password, {
  firstName: 'John',
  lastName: 'Doe'
});

// Customer sign in  
const { user, customer, error } = await supabaseAuth.customer.signIn(email, password);
```

### 4.2 Update API Route Protection
```javascript
// Before (custom JWT)
import { authenticateAdmin } from '../lib/auth.js';

// After (Supabase)
import { supabaseAuth } from '../lib/supabaseAuth.js';
const { requireAdmin } = supabaseAuth.middleware;

export default async function handler(req, res) {
  await requireAdmin(req, res, () => {
    // Your protected code here
  });
}
```

---

## 🖥️ Step 5: Update Frontend Components

### 5.1 Update Admin Authentication (`components/admin/AdminAuth.js`):
```javascript
import { supabaseAuth } from '../../lib/supabaseAuth.js';

// Replace login logic
const handleLogin = async (email, password) => {
  const { user, admin, error } = await supabaseAuth.admin.signIn(email, password);
  if (error) {
    setError(error);
  } else {
    setUser(user);
    setAdmin(admin);
  }
};
```

### 5.2 Update API Client (`lib/apiClient.js`):
Replace the authentication headers to use Supabase session tokens:

```javascript
import { supabase } from './supabase.js';

class ApiClient {
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token 
      ? { Authorization: `Bearer ${session.access_token}` }
      : {};
  }
}
```

---

## 🔒 Step 6: Configure Row Level Security (RLS)

Supabase RLS is already configured in the schema, but you can customize it:

### View Current Policies:
1. Go to **Authentication** → **Policies**
2. Review the auto-generated policies for each table

### Key Security Features:
- **Products**: Public read, admin write
- **Customers**: Users see only their data, admins see all
- **Orders**: Users see their orders, admins see all
- **Cart**: Users manage their own cart only

---

## 📊 Step 7: Enable Real-time Features (Optional)

Add real-time updates to your admin dashboard:

```javascript
import { realtimeHelpers } from '../lib/supabase.js';

// Subscribe to order changes
useEffect(() => {
  const subscription = realtimeHelpers.subscribeToTable('orders', (payload) => {
    console.log('Order update:', payload);
    // Refresh your orders list
    fetchOrders();
  });

  return () => realtimeHelpers.unsubscribe(subscription);
}, []);
```

---

## 🧪 Step 8: Testing & Validation

### 8.1 Test Admin Functions:
1. **Login**: Admin authentication works
2. **Products**: CRUD operations work
3. **Orders**: Can view and update orders
4. **Customers**: Can view customer data
5. **Analytics**: Dashboard shows real data

### 8.2 Test Customer Functions:
1. **Registration**: New customers can sign up
2. **Login**: Customers can authenticate
3. **Cart**: Adding/removing items works
4. **Orders**: Customers can place orders

### 8.3 Test API Endpoints:
```bash
# Test products endpoint
curl http://localhost:3000/api/products

# Test admin login
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@arpozan.com","password":"admin123"}'
```

---

## 🚀 Step 9: Deploy & Go Live

### 9.1 Environment Variables:
Update your production environment with:
- Production Supabase URL and keys
- Secure admin credentials
- Proper CORS settings

### 9.2 Database Backup:
Supabase automatically backs up your database, but you can also:
1. Export data from MongoDB before migration
2. Import initial data to Supabase if needed

---

## ✅ Migration Checklist

- [ ] ✅ Supabase project created and configured
- [ ] ✅ Environment variables updated
- [ ] ✅ Database schema created
- [ ] ✅ Models migrated to Supabase
- [ ] ✅ Authentication system updated
- [ ] ⏳ API routes converted to Supabase
- [ ] ⏳ Frontend components updated
- [ ] ⏳ Testing completed
- [ ] ⏳ Production deployment

---

## 🎉 Benefits After Migration

### 🏆 **Immediate Improvements:**
- **Hosted Database**: No more MongoDB hosting/maintenance
- **Built-in Auth**: Social logins, email confirmation, password reset
- **Real-time Updates**: Live dashboard updates
- **Better Security**: Row Level Security built-in
- **Auto APIs**: Generated REST and GraphQL endpoints

### 📈 **Long-term Benefits:**
- **Scalability**: PostgreSQL scales better than MongoDB for most use cases
- **Ecosystem**: Rich PostgreSQL ecosystem and tooling
- **Compliance**: Better compliance options with Supabase
- **Analytics**: Built-in analytics and monitoring
- **Global CDN**: Supabase Edge for global performance

---

## 🆘 Troubleshooting

### Common Issues:

#### Authentication Errors:
- Check environment variables are correct
- Verify RLS policies are properly configured
- Ensure service role key is set for admin operations

#### Database Connection Issues:
- Verify Supabase URL and keys
- Check database is not paused (free tier)
- Review network/firewall settings

#### Migration Data:
- Use Supabase CLI for bulk data imports
- Consider writing migration scripts for complex data

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/reference/cli)

---

Your ARPOZAN project will be significantly more powerful and easier to maintain with Supabase! 🚀