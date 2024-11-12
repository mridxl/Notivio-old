import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { blogSchema, draftSchema } from '../utils/zodTypes.js';
import zodMessage from '../utils/zodMessage.js';
import createBlogId from '../utils/createBlogId.js';

export default async function handler(req, res) {
	const authorId = req.user;
	const { title, des, content, tags, banner, draft, id } = req.body;
	const isDraft = Boolean(draft);
	let parsedData;

	try {
		if (!isDraft) {
			parsedData = blogSchema.safeParse({
				title,
				des,
				content,
				tags,
				banner,
			});
		} else {
			parsedData = draftSchema.safeParse({
				title,
				des,
				content,
				tags,
				banner,
				draft: isDraft,
			});
		}
		if (!parsedData.success) {
			return res.status(400).json({ error: zodMessage(parsedData) });
		}
		const blog_id = id || createBlogId(title);

		if (id) {
			await Blog.findOneAndUpdate(
				{ blog_id },
				{
					...parsedData.data,
					draft: isDraft,
				}
			);
			return res.json({ id: blog_id });
		} else {
			const blogObj = {
				...parsedData.data,
				blog_id,
				author: authorId,
				draft: isDraft,
			};

			const blog = await Blog.create(blogObj);
			await User.findByIdAndUpdate(authorId, {
				$inc: { 'account_info.total_posts': isDraft ? 0 : 1 },
				$push: { blogs: blog._id },
			});

			return res.json({ id: blog_id });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
