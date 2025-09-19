#!/usr/bin/env node

// Script to create admin accounts in Supabase
// Usage: node create-admin.js <email> <password> [role] [permissions]

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser(email, password, role = 'admin', permissions = ['read', 'write', 'delete']) {
  try {
    console.log(`🚀 Creating admin user: ${email}`);

    // Step 1: Create the auth user
    console.log('📝 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Failed to create auth user:', authError.message);
      return false;
    }

    console.log(`✅ Auth user created with ID: ${authData.user.id}`);

    // Step 2: Create the admin profile
    console.log('👤 Creating admin profile...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([{
        user_id: authData.user.id,
        email,
        role,
        permissions,
        is_active: true
      }])
      .select()
      .single();

    if (adminError) {
      console.error('❌ Failed to create admin profile:', adminError.message);
      // Clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return false;
    }

    console.log('✅ Admin profile created successfully!');
    console.log('📋 Admin Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   Permissions: ${permissions.join(', ')}`);
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Admin ID: ${adminData.id}`);

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('📖 Usage: node create-admin.js <email> <password> [role] [permissions]');
    console.log('\nExamples:');
    console.log('  node create-admin.js admin@example.com mypassword123');
    console.log('  node create-admin.js admin@example.com mypassword123 super_admin');
    console.log('  node create-admin.js admin@example.com mypassword123 admin "read,write,delete,manage_users"');
    process.exit(1);
  }

  const [email, password, role = 'admin', permissionsStr = 'read,write,delete'] = args;
  const permissions = permissionsStr.split(',').map(p => p.trim());

  console.log('🔧 ARPOZAN Admin Account Creator');
  console.log('================================');

  const success = await createAdminUser(email, password, role, permissions);

  if (success) {
    console.log('\n🎉 Admin account created successfully!');
    console.log('💡 You can now log in to the admin panel at /admin');
  } else {
    console.log('\n💥 Failed to create admin account.');
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);