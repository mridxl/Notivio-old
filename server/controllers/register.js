import bcrypt from 'bcrypt';
import { registerSchema } from '../utils/zodTypes.js';
import User from '../models/User.js';
import generateUsername from '../utils/generateUsername.js';
import zodMessage from '../utils/zodMessage.js';
import formatUserResponse from '../utils/formatUserResponse.js';
import generateAccessToken from '../utils/generateAccessToken.js';
// @access  Public
export default async function (req, res) {
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
		if (newUser) {
			generateAccessToken(res, newUser._id);
			return res.status(201).json({
				message: 'User created successfully',
				user: formatUserResponse(newUser),
			});
		} else {
			return res.status(400).json({ error: 'User not created' });
		}
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
