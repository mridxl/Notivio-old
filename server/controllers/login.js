import bcrypt from 'bcrypt';
import { loginSchema } from '../utils/zodTypes.js';
import User from '../models/User.js';
import zodMessage from '../utils/zodMessage.js';
import formatUserResponse from '../utils/formatUserResponse.js';
import generateAccessToken from '../utils/generateAccessToken.js';

export default async function (req, res) {
	const parsedPayload = loginSchema.safeParse(req.body);
	if (!parsedPayload.success) {
		return res.status(400).json({ error: zodMessage(parsedPayload) });
	}
	try {
		const { email, password } = parsedPayload.data;
		const user = await User.findOne({ 'personal_info.email': email });

		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}
		const isPasswordValid = await bcrypt.compare(
			password,
			user.personal_info.password
		);

		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		generateAccessToken(res, user);

		return res.status(200).json({
			message: 'User logged in successfully',
			user: formatUserResponse(user),
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
}
