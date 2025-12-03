const supabase = require('../config/supabaseClient');

async function getJournalsByUser(userId) {
	// returns all journals for a user ordered by created_at desc
	const { data, error } = await supabase
		.from('wb_journal')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

async function getJournalById(id) {
	const { data, error } = await supabase
		.from('wb_journal')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;
	return data;
}

async function toggleFav(journalId, fav) {
	const { data, error } = await supabase
		.from('wb_journal')
		.update({ fav: !!fav, updated_at: new Date().toISOString() })
		.eq('id', journalId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

async function updateJournal(journalId, { title, body, mood, topics, created_at, fav }) {
	const patch = {
		updated_at: new Date().toISOString(),
	};
	if (title !== undefined) patch.title = title;
	if (body !== undefined) patch.body = body;
	if (mood !== undefined) patch.mood = mood;
	if (topics !== undefined) patch.topics = topics;
	if (created_at !== undefined) patch.created_at = new Date(created_at).toISOString();
	if (fav !== undefined) patch.fav = !!fav;

	const { data, error } = await supabase
		.from('wb_journal')
		.update(patch)
		.eq('id', journalId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

module.exports = {
	getJournalsByUser,
	getJournalById,
	toggleFav,
	updateJournal,
};
