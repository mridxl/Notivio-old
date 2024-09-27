import { useState } from 'react';
import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';

export default function Editor() {
	const [editorState, setEditorState] = useState('editor');
	return <>{editorState === 'editor' ? <BlogEditor /> : <PublishForm />}</>;
}
