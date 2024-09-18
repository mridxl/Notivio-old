import { z } from 'zod';

export const registerSchema = z.object({
	fullname: z.string().min(3, 'Full name must be at least 3 characters long'),
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.regex(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
			'Password must be 6-20 characters long, contain at least one digit, one lowercase letter, and one uppercase letter.'
		),
});

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string(),
});
