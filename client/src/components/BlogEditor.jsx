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
		if (input) {
			input.style.height = 'auto';
			input.style.height = input.scrollHeight + 'px';
		}

		if (!editorRef.current) {
			try {
				const blogContent =
					blog.content && typeof blog.content === 'object'
						? blog.content
						: { blocks: [] };

				const instance = new EditorJS({
					holder: 'editor-js',
					tools: tools,
					data: blogContent,
					placeholder: "Let's write an awesome story!",
					onChange: async () => {
						try {
							const content = await instance.save();

							if (!content || !content.blocks) {
								console.warn('Editor content is empty or invalid');
								return;
							}

							const validBlocks = content.blocks.filter((block) => {
								return (
									block &&
									block.type &&
									block.data &&
									Object.keys(block.data).length > 0
								);
							});

							// Create new block objects to avoid modifying read-only properties
							const updatedContentBlocks = validBlocks.map((block) => {
								const newBlock = {
									id: block.id,
									type: block.type,
									data: { ...block.data },
								};

								// Handle different block types
								switch (block.type) {
									case 'image':
										newBlock.data = {
											...newBlock.data,
											caption: newBlock.data.caption || '',
										};
										break;
									case 'embed':
										// Create a new embed data object without modifying the original
										newBlock.data = {
											service: block.data.service,
											source: block.data.source,
											embed: block.data.embed,
											width: block.data.width,
											height: block.data.height,
											caption: block.data.caption || '',
										};
										break;
									default:
										// For other block types, just use the spread operator
										newBlock.data = { ...block.data };
								}

								return newBlock;
							});

							const updatedContent = {
								time: content.time || Date.now(),
								blocks: updatedContentBlocks,
								version: content.version,
							};

							setBlog((prev) => ({ ...prev, content: updatedContent }));
						} catch (error) {
							// Ignore specific read-only property errors during autosave
							if (
								error instanceof TypeError &&
								error.message.includes('read only property')
							) {
								console.warn(
									'Handled read-only property error during autosave'
								);
								return;
							}
							console.error('Editor save failed:', error);
							toast.error('Failed to save content. Please try again.');
						}
					},
				});

				instance.isReady
					.then(() => {
						editorRef.current = instance;
						setEditor(instance);
					})
					.catch((error) => {
						console.error('Editor initialization failed:', error);
						toast.error(
							'Failed to initialize editor. Please refresh the page.'
						);
					});
			} catch (error) {
				console.error('Editor setup failed:', error);
				toast.error('Failed to setup editor. Please refresh the page.');
			}
		}

		return () => {
			if (editorRef.current) {
				try {
					editorRef.current.destroy();
					editorRef.current = null;
				} catch (error) {
					console.error('Editor cleanup failed:', error);
				}
			}
		};
	}, []);
	async function handleSaveDraft(e) {
		e.preventDefault();
		if (e.target.classList.contains('disable')) return;

		if (!blog.title?.trim()?.length || blog.title.trim().length < 3) {
			toast.error('Title is required and must be at least 3 characters long');
			return;
		}

		const loadingToast = toast.loading('Saving draft...');
		e.target.classList.add('disable');
		e.target.style.cursor = 'not-allowed';

		try {
			// Ensure we have valid content before saving
			const content = editor ? await editor.save() : blog.content;
			if (!content || !content.blocks) {
				throw new Error('No valid content to save');
			}

			const res = await api.post('/create-blog', {
				title: blog.title,
				des: blog.description,
				content: content,
				tags: blog.tags,
				banner: blog.banner,
				draft: true,
			});

			toast.dismiss(loadingToast);
			toast.success('Draft saved successfully');

			resetBlog();
			resetEditorState();

			setTimeout(() => navigate('/'), 500);
		} catch (error) {
			console.error('Save draft failed:', error);
			toast.dismiss(loadingToast);
			toast.error(error.response?.data?.error || 'Failed to save draft');

			e.target.classList.remove('disable');
			e.target.style.cursor = 'pointer';
		}
	}

	async function handleBannerUpload(e) {
		const file = e.target.files?.[0];
		if (!file) return;

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

	function handleTitleChange(e) {
		const input = e.target;
		input.style.height = 'auto';
		input.style.height = input.scrollHeight + 'px';
		setBlog((prev) => ({ ...prev, title: input.value }));
	}

	async function handlePublish() {
		if (
			!blog.title?.trim()?.length ||
			blog.title.trim().length < 3 ||
			blog.title.trim().length > 100
		) {
			toast.error('Title must be between 3 and 100 characters');
			return;
		}

		if (!blog.banner) {
			toast.error('Please upload a banner image');
			return;
		}

		try {
			const content = await editor?.save();
			if (!content || !content.blocks || content.blocks.length === 0) {
				toast.error('Please add some content to your blog');
				return;
			}
			setEditorState('publish');
		} catch (error) {
			console.error('Publish preparation failed:', error);
			toast.error(
				'Failed to prepare content for publishing. Please try again.'
			);
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
