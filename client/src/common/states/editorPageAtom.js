import { atom } from 'recoil';

const editorPageAtom = atom({
	key: 'editorPageAtom',
	default: 'editor',
});

export default editorPageAtom;
