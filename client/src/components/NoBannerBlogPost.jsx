import { Link } from 'react-router-dom';
import formatDate from '../common/date';

export default function MinimalBlogCard({ blog, index }) {
	const {
		title,
		blog_id: id,
		publishedAt,
		author: {
			personal_info: { fullname, username, profile_img },
		},
	} = blog;

	return (
		<Link
			to={`/blog/${id}`}
			className="flex gap-5 mb-8 pb-5 border-b border-grey/20"
		>
			<h1 className="blog-index">
				{index < 9 ? '0' + (index + 1) : index + 1}
			</h1>
			<div>
				<div className="flex gap-2 items-center mb-7">
					<img
						src={profile_img}
						alt="profile image"
						className="h-6 w-6 rounded-full"
					/>
					<p className="line-clamp-1">
						{fullname} @{username}
					</p>
					<p className="min-w-fit">{formatDate(publishedAt)}</p>
				</div>
				<h1 className="blog-title">{title}</h1>
			</div>
		</Link>
	);
}
