import { Link } from 'react-router-dom';
import formatDate from '../common/date';

export default function BlogPostCard({ content, author }) {
	const {
		title,
		des,
		banner,
		publishedAt,
		tags,
		activity: { total_likes },
		blog_id: id,
	} = content;
	const { profile_img, fullname, username } = author;

	return (
		<Link
			to={`/blog/${id}`}
			className="flex gap-8 items-center border-b border-grey/80 pb-5 mb-4"
		>
			<div className="w-full">
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
				<p className="text-xl font-gelasio my-3 leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
					{des}
				</p>
				<div className="flex gap-4 mt-7">
					<span className="btn-light py-1 px-4">{tags[0]}</span>
					<span className="ml-3 flex items-center gap-2 text-dark-grey">
						<i className="fi fi-ss-heart text-xl"></i>
						{total_likes}
					</span>
				</div>
			</div>
			<div className="h-36 aspect-square bg-grey ">
				<img
					src={banner}
					alt="blog banner"
					className="w-full h-full object-cover aspect-square"
				/>
			</div>
		</Link>
	);
}
