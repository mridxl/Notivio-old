import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';
import { useRecoilValue } from 'recoil';
import editorPageAtom from '../common/states/editorPageAtom';

export default function Editor() {
	const editorState = useRecoilValue(editorPageAtom);
	return <>{editorState === 'editor' ? <BlogEditor /> : <PublishForm />}</>;
}
