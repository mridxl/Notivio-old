import User from '../models/User.js';

export default async function getProfile(req, res) {
	try {
		const { q: username } = req.query;
		if (!username) {
			return res.status(400).json({ error: 'Please enter a username' });
		}
		// Find the user in the database
		const user = await User.findOne({
			'personal_info.username': username,
		}).select(
			'-personal_info.password -google_auth -blogs -_id -updatedAt -__v'
		);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.status(200).json({ user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}
