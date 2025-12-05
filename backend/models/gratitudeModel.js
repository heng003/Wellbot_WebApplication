const supabase = require('../config/supabaseClient');

async function getGratitudesByUser(userId) {
	const { data, error } = await supabase
		.from('wb_gratitude_item')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

async function getGratitudeById(id) {
	const { data, error } = await supabase
		.from('wb_gratitude_item')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;
	return data;
}

async function toggleFav(gratitudeId, fav) {
	const { data, error } = await supabase
		.from('wb_gratitude_item')
		.update({ fav: !!fav, updated_at: new Date().toISOString() })
		.eq('id', gratitudeId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

async function updateGratitude(gratitudeId, { text, created_at, fav }) {
	const patch = {
		updated_at: new Date().toISOString(),
	};
	if (text !== undefined) patch.text = text;
	if (created_at !== undefined) patch.created_at = new Date(created_at).toISOString();
	if (fav !== undefined) patch.fav = !!fav;

	const { data, error } = await supabase
		.from('wb_gratitude_item')
		.update(patch)
		.eq('id', gratitudeId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

async function createGratitude({ user_id, text, fav }) {
	const gratitude = {
		created_at: new Date().toISOString(),
	};

	if (user_id !== undefined) gratitude.user_id = user_id;
	if (text !== undefined) gratitude.text = text;
	if (fav !== undefined) gratitude.fav = !!fav;
	console.log('gratitude.fav', gratitude.fav);

	const { data, error } = await supabase
		.from('wb_gratitude_item')
		.insert([gratitude])
		.select()
		.single();

	if (error) throw error;
	return data;
}

async function deleteGratitude(gratitudeId) {
    const { error } = await supabase
        .from('wb_gratitude_item')
        .delete()
        .eq('id', gratitudeId);
    if (error) throw error;
}

module.exports = {
	getGratitudesByUser,
	getGratitudeById,
	toggleFav,
	updateGratitude,
	createGratitude,
	deleteGratitude,
};
