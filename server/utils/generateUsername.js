import User from '../models/User.js';
export default async (email) => {
	const username = email.split('@')[0];
	const user = await User.findOne({
		'personal_info.username': username,
	});
	if (!user) {
		return username;
	}
	return `${username}${Math.floor(Math.random() * 1000)}`;
};
