import User from '../models/User.js';
export default async (email) => {
	const username = email.split('@')[0];
	const user = await User.findOne({
		'personal_info.username': username,
	});
	if (!user) {
		if (username.length <= 3)
			return `${username}${Math.floor(Math.random() * 1000)}`;
		return username;
	}
	return `${username}${Math.floor(Math.random() * 1000)}`;
};
