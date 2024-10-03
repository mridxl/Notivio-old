import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import blogAtom from '../common/states/blogAtom.js';
import editorPageAtom from '../common/states/editorPageAtom.js';
import api from '../api/api.js';
import uploadCloudinaryImage from '../common/config/cloudinary.jsx';
import AnimationWrapper from '../common/pageAnimation';
import logo from '../imgs/logo.png';
import defaultBanner from '../imgs/blog-banner.png';
import EditorJS from '@editorjs/editorjs';
import tools from '../common/config/tools.jsx';

export default function BlogEditor() {
	const [blog, setBlog] = useRecoilState(blogAtom);
	const resetBlog = useResetRecoilState(blogAtom);
	const setEditorState = useSetRecoilState(editorPageAtom);
	const resetEditorState = useResetRecoilState(editorPageAtom);
	const [editor, setEditor] = useState(null);
	const navigate = useNavigate();
	const editorRef = useRef(null);
	const titleRef = useRef(null);

	useEffect(() => {
		const input = titleRef.current;
		input.style.height = 'auto';
		input.style.height = input.scrollHeight + 'px';

		if (!editorRef.current) {
			const blogContent = blog.content;
			const instance = new EditorJS({
				holder: 'editor-js',
				tools: tools,
				data: blogContent || {},
				placeholder: "Let's write an awesome story!",
				onChange: async () => {
					try {
						let content = await instance.save();
						// if content type is image and capton is empty, replcae it by 'Image'
						const updatedContentBlocks = content.blocks.map((block) => {
							let caption;
							if (block.type === 'image' && !block.data.caption) {
								caption = '';
							}
							return { ...block, data: { ...block.data, caption } };
						});
						const updatedContent = { ...content, blocks: updatedContentBlocks };

						setBlog((prev) => ({ ...prev, content: updatedContent }));
					} catch (error) {
						console.error('Saving failed: ', error);
					}
				},
			});

			instance.isReady.then(() => {
				editorRef.current = instance;
				setEditor(instance);
			});
		}
		return () => {
			if (editorRef.current) {
				editorRef.current.destroy();
				editorRef.current = null;
			}
		};
	}, []);

	async function handleSaveDraft(e) {
		e.preventDefault();
		if (e.target.classList.contains('disable')) return;

		if (!blog.title.trim().length || blog.title.trim().length < 3) {
			toast.error('Title is required to save draft');
			return;
		}

		const loading = toast.loading('Saving draft...');

		e.target.style.cursor = 'not-allowed';
		e.target.classList.add('disable');

		try {
			const res = await api.post('/create-blog', {
				title: blog.title,
				des: blog.description,
				content: blog.content,
				tags: blog.tags,
				banner: blog.banner,
				draft: true,
			});

			resetBlog();
			resetEditorState();
			toast.dismiss(loading);
			toast.success('Draft saved successfully');

			setTimeout(() => {
				navigate(`/`);
			}, 500);
		} catch (e) {
			console.error(response.data.error);
			toast.dismiss(loading);
			toast.error(response.data.error);

			e.target.classList.remove('disable');
			e.target.style.cursor = 'pointer';
		}
	}

	async function handleBannerUpload(e) {
		const file = e.target.files[0];
		if (file) {
			toast.promise(
				uploadCloudinaryImage(file).then((uploadedImageUrl) => {
					if (!uploadedImageUrl) {
						throw new Error('No URL returned from Cloudinary');
					}
					setBlog((prev) => ({ ...prev, banner: uploadedImageUrl }));
					return uploadedImageUrl;
				}),
				{
					loading: 'Uploading banner image...',
					success: 'Banner image uploaded successfully!',
					error: 'Failed to upload banner image',
				}
			);
		}
	}

	function handleTitleChange(e) {
		let input = e.target;
		input.style.height = 'auto';
		input.style.height = input.scrollHeight + 'px';
		setBlog((prev) => ({ ...prev, title: input.value }));
	}

	async function handlePublish() {
		if (
			!blog.title.trim().length ||
			blog.title.trim().length < 3 ||
			blog.title.trim().length > 100
		) {
			return toast.error('Title must be between 3 and 100 characters');
		}
		if (!blog.banner) {
			return toast.error('Please upload a banner image');
		}
		if (editor) {
			const content = await editor.save();
			if (content.blocks.length === 0) {
				return toast.error('Please add some content to your blog');
			}
			setEditorState('publish');
		}
	}

	return (
		<>
			<Toaster />
			<nav className="navbar">
				<Link to="/" className="flex-none w-10 md:w-12">
					<img src={logo} alt="logo" className="w-full" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full text-xl pt-1">
					{blog.title || 'New Blog'}
				</p>
				<div className="flex gap-4 ml-auto">
					<button className="btn-dark py-2" onClick={handlePublish}>
						Publish
					</button>
					<button className="btn-light py-2" onClick={handleSaveDraft}>
						Save Draft
					</button>
				</div>
			</nav>
			<AnimationWrapper>
				<section className="mx-auto max-w-[900px] w-full">
					<div className="relative aspect-video border-4 border-grey hover:opacity-80">
						<label htmlFor="banner-upload">
							<img
								src={blog.banner || defaultBanner}
								alt="blog banner"
								className="z-20"
							/>
							<input
								id="banner-upload"
								type="file"
								accept=".png, .jpg, .jpeg"
								hidden
								onChange={handleBannerUpload}
							/>
						</label>
					</div>
					<textarea
						defaultValue={blog.title}
						placeholder="Blog Title"
						className="text-4xl font-medium w-full h-16 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
						onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
						onChange={handleTitleChange}
						ref={titleRef}
					/>
					<hr className="w-full opacity-10 my-5" />
					<div id="editor-js" className="font-gelasio" />
				</section>
			</AnimationWrapper>
		</>
	);
}
