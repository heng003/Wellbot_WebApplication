const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: false,
	},
	realtime: {
		params: {
			eventsPerSecond: 10,
		},
		timeout: 20000,
	},
});

async function testConnection() {
	try {
		const { data, error } = await supabase.from('users').select('*').limit(1);
		if (error) {
			console.error('Supabase connection failed:', error.message || error);
		} else {
			console.log('Supabase connection successful!', data);
		}
	} catch (err) {
		console.error('Supabase client error:', err && err.message ? err.message : err);
	}
}

if (process.env.NODE_ENV !== 'production') {
	testConnection();
}

module.exports = supabase;