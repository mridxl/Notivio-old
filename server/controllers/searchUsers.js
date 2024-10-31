import User from '../models/User.js';

export default async function searchUsers(req, res) {
	const { q } = req.query;
	const maxLimit = 50;
	try {
		const users = await User.find({
			'personal_info.username': new RegExp(q, 'i'),
		})
			.limit(maxLimit)
			.select(
				'personal_info.fullname personal_info.username personal_info.profile_img  -_id'
			);
		return res.json({ users });
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
}
