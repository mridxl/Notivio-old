import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import editorPageAtom from '../common/states/editorPageAtom';
import AnimationWrapper from '../common/pageAnimation';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/api';
import blogAtom from '../common/states/blogAtom';
import Tag from './Tag';
import { useNavigate, useParams } from 'react-router-dom';

export default function PublishForm() {
	const characterLimit = 200;
	const tagsLimit = 10;

	const navigate = useNavigate();
	const [blog, setBlog] = useRecoilState(blogAtom);
	const resetBlog = useResetRecoilState(blogAtom);
	const { id } = useParams();
	const setEditorState = useSetRecoilState(editorPageAtom);
	const resetEditorState = useResetRecoilState(editorPageAtom);

	async function handleBlogPublish(e) {
		e.preventDefault();
		if (e.target.classList.contains('disable')) return;

		if (!blog.title.trim().length || blog.title.trim().length < 3) {
			toast.error('Title should be at least 3 characters long');
			return;
		}
		if (!blog.des.trim().length) {
			toast.error('Write a short description to publish the blog');
			return;
		}
		if (!blog.tags.length) {
			toast.error('Add at least one tag to help readers find your blog');
			return;
		}
		const loading = toast.loading('Publishing your blog...');

		e.target.style.cursor = 'not-allowed';
		e.target.classList.add('disable');

		try {
			await api.post('/create-blog', {
				title: blog.title,
				des: blog.des,
				content: blog.content,
				tags: blog.tags,
				banner: blog.banner,
				draft: false,
				id,
			});

			toast.dismiss(loading);
			toast.success('Blog published successfully');

			setTimeout(() => {
				resetBlog();
				resetEditorState();
				navigate(`/`);
			}, 700);
		} catch ({ response }) {
			console.error(response.data.error);
			toast.dismiss(loading);
			toast.error(response.data.error);

			e.target.classList.remove('disable');
			e.target.style.cursor = 'pointer';
		}
	}

	function handleclose() {
		setEditorState('editor');
	}

	function handleKeyDown(e) {
		const specialCharacters = [
			'#',
			'$',
			'%',
			'&',
			'*',
			'(',
			')',
			'+',
			'=',
			'[',
			']',
			'{',
			'}',
			'<',
			'>',
			'/',
			'?',
			'!',
			'@',
			'^',
			'~',
			'`',
			'|',
			'"',
			"'",
			':',
			';',
			'.',
			'-',
			'_',
			'\\',
		];
		if (specialCharacters.includes(e.key)) {
			e.preventDefault();
			toast.error('Special characters are not allowed');
		}

		if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
			e.preventDefault();
			if (blog.tags.length < tagsLimit) {
				const newTag = e.target.value.toLowerCase().trim();

				if (newTag === '') return;
				else if (!blog.tags.includes(newTag)) {
					setBlog({ ...blog, tags: [...blog.tags, newTag] });
					e.target.value = '';
				} else {
					toast.error('Tag already exists');
				}
			} else {
				toast.error('You can only add up to 10 tags');
			}
			e.target.value = '';
		}
	}

	return (
		<AnimationWrapper>
			<section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
				<Toaster />
				<button
					onClick={handleclose}
					className="w-12 h-12 absolute right-[5vw] top-[5%] lg:top-[10%] z-10"
				>
					<i className="fi fi-br-cross"></i>
				</button>

				{/* preview */}
				<div className="max-w-[550px] center">
					<p className="text-dark-grey mb-1">Preview</p>
					<div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
						<img src={blog.banner} alt="blog banner" />
					</div>
					<h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
						{blog.title}
					</h1>
					<p className="text-xl font-gelasio line-clamp-2 leading-7 mt-4">
						{blog.des}
					</p>
				</div>

				{/* form */}
				<div className="border-grey lg:pl-8">
					<p className="text-dark-grey mb-2 mt-9">Blog Title</p>
					<input
						type="text"
						placeholder="Blog Title"
						defaultValue={blog.title}
						className="input-box pl-4"
						onChange={(e) => {
							setBlog({ ...blog, title: e.target.value });
						}}
					/>

					<p className="text-dark-grey mb-2 mt-9">
						Short description about your blog
					</p>
					<textarea
						maxLength={characterLimit}
						defaultValue={blog.des}
						className="h-40 resize-none input-box leading-7 pl-4"
						onChange={(e) => {
							setBlog({ ...blog, des: e.target.value });
						}}
						onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
					></textarea>
					<p
						className={
							'text-dark-grey mt-1 text-right ' +
							(characterLimit - blog.des.length === 0 ? 'text-error' : '')
						}
					>
						{characterLimit - blog.des.length} characters left
					</p>

					<p className="text-dark-grey/80 mt-9 mb-0">
						Topics: Helps readers to find your blog
					</p>
					<div className="input-box pl-2 py-2 pb-4 relative">
						<input
							type="text"
							placeholder="Topics"
							className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white placeholder:text-dark-grey placeholder:text-opacity-80"
							onKeyDown={handleKeyDown}
						/>
						{blog.tags.map((tag, index) => (
							<Tag key={index} tag={tag} />
						))}
					</div>
					<p
						className={
							'text-dark-grey mb-4 mt-1 text-right ' +
							(tagsLimit - blog.tags.length === 0 ? 'text-error' : '')
						}
					>
						{tagsLimit - blog.tags.length} tags left
					</p>

					<button
						className="btn-dark px-8"
						onClick={(e) => handleBlogPublish(e)}
					>
						Publish
					</button>
				</div>
			</section>
		</AnimationWrapper>
	);
}
