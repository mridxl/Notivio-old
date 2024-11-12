import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import editorPageAtom from '../common/states/editorPageAtom';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { unsecureApi } from '../api/api';
import blogAtom from '../common/states/blogAtom';
import userAtom from '../common/states/userAtom';

export default function Editor() {
	const editorState = useRecoilValue(editorPageAtom);
	const { id } = useParams();
	const setBlog = useSetRecoilState(blogAtom);
	const { user } = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const resetBlog = useResetRecoilState(blogAtom);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) {
			resetBlog();
			return setLoading(false);
		}

		const getBlog = async () => {
			try {
				const res = await unsecureApi.get('/get-blog', {
					params: { id, mode: 'edit', draft: true },
				});
				if (
					res.data?.blog?.author?.personal_info?.username?.toLowerCase() !==
					user?.username?.toLowerCase()
				) {
					console.log('Unauthorized');
					navigate('/404');
					return;
				}
				setBlog(res.data.blog);
			} catch (err) {
				console.log(err);
				resetBlog();
			} finally {
				setLoading(false);
			}
		};
		getBlog();
	}, [id]);

	return (
		<>
			{loading ? (
				<Loader />
			) : editorState === 'editor' ? (
				<BlogEditor />
			) : (
				<PublishForm />
			)}
		</>
	);
}
