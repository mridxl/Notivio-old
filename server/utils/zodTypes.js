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

const blockDataSchema = z
	.object({
		text: z.string().optional().default(''), //  Now optional with a default
	})
	.passthrough(); // Allow additional properties

const blockSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		data: blockDataSchema, // Use the updated blockDataSchema
	})
	.passthrough();

const contentSchema = z.object({
	time: z.number(),
	blocks: z.array(blockSchema), // Use the updated blockSchema
});

export const blogSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters long'),
	des: z.string().max(200, 'Description must be at most 200 characters long'),
	content: contentSchema,
	tags: z.array(z.string()).max(10, 'Maximum 10 tags are allowed'),
	banner: z.string(),
	draft: z.optional(z.boolean()),
});

export const draftSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters long'),
	des: z
		.string()
		.max(200, 'Description must be at most 200 characters long')
		.optional(),
	content: contentSchema.optional(),
	tags: z.array(z.string()).max(10, 'Maximum 10 tags are allowed').optional(),
	banner: z.string().optional(),
	draft: z.boolean(),
});
