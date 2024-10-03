import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { blogSchema, draftSchema } from '../utils/zodTypes.js';
import zodMessage from '../utils/zodMessage.js';
import createBlogId from '../utils/createBlogId.js';

export default async function (req, res) {
	const authorId = req.user;
	const { title, des, content, tags, banner, draft } = req.body;
	const isDraft = Boolean(draft);

	if (!isDraft) {
		const parsedData = blogSchema.safeParse({
			title,
			des,
			content,
			tags,
			banner,
		});

		if (!parsedData.success) {
			return res.status(400).json({ error: zodMessage(parsedData) });
		}

		const blog_id = createBlogId(title);
		const blogObj = {
			...parsedData.data,
			blog_id,
			author: authorId,
			draft: isDraft,
		};
		try {
			const blog = await Blog.create(blogObj);
			await User.findByIdAndUpdate(
				{ _id: authorId },
				{
					$inc: { 'account_info.total_posts': 1 },
					$push: { blogs: blog._id },
				}
			);
			return res.json({ id: blog_id });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	} else {
		const parsedData = draftSchema.safeParse({
			title,
			des,
			content,
			tags,
		});

		if (!parsedData.success) {
			return res.status(400).json({ error: zodMessage(parsedData) });
		}

		const blog_id = createBlogId(title);
		const draftObj = {
			...parsedData.data,
			blog_id,
			author: authorId,
			draft: isDraft,
		};
		try {
			await Blog.create(draftObj);
			return res.json({ id: blog_id });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
	return res.status(400).json({ error: 'Invalid request' });
}
