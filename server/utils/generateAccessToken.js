import jwt from 'jsonwebtoken';

const generateAccessToken = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '15d',
	});

	res.cookie('token', token, {
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
	});

	return token;
};

export default generateAccessToken;
