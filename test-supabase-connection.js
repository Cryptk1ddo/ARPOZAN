// Test script to verify Supabase connection and database schema
import { supabase } from './lib/supabase.js';

async function testSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('products').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('📝 Please run the SQL schema in your Supabase dashboard first');
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log(`📊 Products table exists with ${data?.length || 0} records`);
    
    // Test other tables
    const tables = ['customers', 'orders', 'admin_users', 'analytics'];
    
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('count', { count: 'exact' });
          
        if (tableError) {
          console.error(`❌ Table '${table}' not found:`, tableError.message);
        } else {
          console.log(`✅ Table '${table}' exists`);
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err.message);
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupabaseConnection();
}

export default testSupabaseConnection;