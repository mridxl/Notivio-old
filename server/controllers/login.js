import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../zodTypes.js';
import User from '../models/User.js';
import zodMessage from './utils/zodMessage.js';
import formatUserResponse from './utils/formatUserResponse.js';

export default async function (req, res) {
	const parsedPayload = loginSchema.safeParse(req.body);
	if (!parsedPayload.success) {
		return res.status(400).json({ error: zodMessage(parsedPayload) });
	}
	try {
		const { email, password } = parsedPayload.data;
		const user = await User.findOne({ 'personal_info.email': email }).exec();

		if (!user) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}
		const isPasswordValid = await bcrypt.compare(
			password,
			user.personal_info.password
		);

		if (!isPasswordValid) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
		});

		return res.status(200).json({
			message: 'User logged in successfully',
			user: formatUserResponse(user),
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
}
