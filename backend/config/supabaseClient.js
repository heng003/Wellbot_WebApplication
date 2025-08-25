const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Supabase connection failed:', error.message);
  } else {
    console.log('Supabase connection successful!', data);
  }
}
testConnection();

module.exports = supabase;