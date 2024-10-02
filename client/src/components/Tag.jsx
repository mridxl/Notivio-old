import { useRecoilState } from 'recoil';
import blogAtom from '../common/states/blogAtom';

export default function Tag({ tag }) {
	const [blog, setBlog] = useRecoilState(blogAtom);

	const deleteTag = () => {
		const updatedTags = blog.tags.filter((t) => t !== tag);
		setBlog({ ...blog, tags: updatedTags });
	};

	return (
		<div className="relative p-2 mt-2 mr-2 px-5 pr-10 bg-white rounded-full inline-block hover:bg-opacity-50">
			<p className="pointer-events-none">{tag}</p>
			<button
				className="mt-[2px] rounded-full right-3 absolute top-1/2 -translate-y-1/2"
				onClick={deleteTag}
			>
				<i className="fi fi-br-cross text-sm pointer-events-none"></i>
			</button>
		</div>
	);
}
