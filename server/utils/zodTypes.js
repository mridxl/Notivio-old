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

export const blogSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters long'),
	des: z.string().max(200, 'Description must be at most 200 characters long'),
	content: z.object({
		blocks: z.array(
			z.object({
				type: z.string(),
				data: z.object({
					text: z.string(),
				}),
			})
		),
	}),
	tags: z.array(z.string()).max(10, 'Maximum 10 tags are allowed'),
	banner: z.string(),
	draft: z.optional(z.boolean()),
});

export const draftSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters long'),
	des: z.optional(
		z.string().max(200, 'Description must be at most 200 characters long')
	),
	content: z.optional(
		z.object({
			blocks: z.array(
				z.object({
					type: z.string(),
					data: z.object({
						text: z.string(),
					}),
				})
			),
		})
	),
	tags: z.optional(z.array(z.string()).max(10, 'Maximum 10 tags are allowed')),
	banner: z.optional(z.string()),
	draft: z.optional(z.optional(z.boolean())),
});
