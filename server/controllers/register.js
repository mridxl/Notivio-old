import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema } from '../zodTypes.js';
import User from '../models/User.js';
import generateUsername from './utils/generateUsername.js';
import zodMessage from './utils/zodMessage.js';
import formatUserResponse from './utils/formatUserResponse.js';

export default async function register(req, res) {
	const parsedPayload = registerSchema.safeParse(req.body);
	if (!parsedPayload.success) {
		return res.status(400).json({ error: zodMessage(parsedPayload) });
	}
	const { fullname, email, password } = parsedPayload.data;
	const hash = await bcrypt.hash(password, 10);

	try {
		const username = await generateUsername(email);
		const newUser = await User.create({
			personal_info: {
				fullname,
				email,
				password: hash,
				username,
			},
		});
		const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
		});

		return res.status(200).json({
			message: 'User created successfully',
			user: formatUserResponse(newUser),
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(401).json({
				error: 'Email already exists. Try again with a different email.',
			});
		}
		console.error(error);
		return res.status(500).json({ error: 'Something went wrong' });
	}
}
