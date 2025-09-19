# Admin Account Creation Guide

This guide provides multiple methods to create admin accounts in your ARPOZAN Supabase setup.

## Prerequisites

Before creating admin accounts, ensure you have:

1. **Supabase Project**: Set up with the ARPOZAN schema
2. **Environment Variables**: Properly configured in `.env.local`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## Method 1: Using the Node.js Script (Recommended)

The easiest way to create admin accounts is using the provided script.

### Basic Usage

```bash
# Navigate to your project directory
cd /workspaces/ARPOZAN

# Create a basic admin account
node scripts/create-admin.js admin@example.com mypassword123

# Create an admin with custom role and permissions
node scripts/create-admin.js admin@example.com mypassword123 super_admin "read,write,delete,manage_users"
```

### Script Features

- ✅ Creates both auth user and admin profile
- ✅ Auto-confirms email addresses
- ✅ Sets default permissions
- ✅ Handles errors gracefully
- ✅ Provides detailed output

## Method 2: Using the Web Interface

Access the admin creation page at `/admin/create-admin` in your application.

### Steps

1. Navigate to `http://localhost:3000/admin/create-admin`
2. Fill in the admin details:
   - Email address
   - Password (minimum 8 characters)
   - Optional: First name, last name
   - Role (admin, super_admin, moderator)
   - Permissions (comma-separated)
3. Click "Create Admin User"

## Method 3: Using the API Endpoint

Make a POST request to the admin creation endpoint.

### Example Request

```bash
curl -X POST http://localhost:3000/api/admin/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "mypassword123",
    "role": "admin",
    "permissions": ["read", "write", "delete"],
    "firstName": "John",
    "lastName": "Admin"
  }'
```

### API Response

```json
{
  "success": true,
  "message": "Admin user created successfully",
  "admin": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "role": "admin",
    "permissions": ["read", "write", "delete"],
    "is_active": true,
    "created_at": "2025-01-17T10:00:00Z"
  }
}
```

## Method 4: Manual SQL in Supabase Dashboard

For advanced users, you can create admin accounts directly in the Supabase SQL Editor.

### Step 1: Create Auth User

```sql
-- Insert into auth.users (this requires service role key)
-- Note: This is typically done via the admin API
```

### Step 2: Create Admin Profile

```sql
INSERT INTO admin_users (
  user_id,
  email,
  role,
  permissions,
  is_active
) VALUES (
  'your-auth-user-id-here',
  'admin@example.com',
  'admin',
  ARRAY['read', 'write', 'delete'],
  true
);
```

## Admin User Structure

The `admin_users` table has the following structure:

```sql
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Available Roles and Permissions

### Roles
- `admin`: Standard administrator
- `super_admin`: Full system access
- `moderator`: Limited administrative access

### Common Permissions
- `read`: View data and reports
- `write`: Create and modify content
- `delete`: Delete records
- `manage_users`: Manage user accounts
- `manage_orders`: Handle order management
- `view_analytics`: Access analytics data

## Security Notes

1. **Service Role Key**: Only use the service role key for admin operations
2. **Password Requirements**: Minimum 8 characters
3. **Email Confirmation**: Accounts are auto-confirmed for admin users
4. **Row Level Security**: Admin operations respect RLS policies

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env.local` contains all required variables
   - Check variable names match exactly

2. **"Failed to create auth user"**
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
   - Check Supabase project permissions

3. **"Email already exists"**
   - Use a different email address
   - Check existing users in Supabase Auth

4. **Permission denied errors**
   - Ensure the service role key has admin privileges
   - Check RLS policies on admin_users table

### Getting Help

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify your Supabase project configuration
3. Ensure the database schema is properly deployed
4. Test with the web interface first to isolate API issues

## Next Steps

After creating admin accounts:

1. Test login at `/admin`
2. Verify admin panel functionality
3. Set up additional admin users as needed
4. Configure role-based access control
5. Review and adjust permissions as required