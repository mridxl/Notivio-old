import { atom } from 'recoil';

const blogAtom = atom({
	key: 'blogAtom',
	default: {
		title: '',
		banner: '',
		des: '',
		content: {},
		tags: [],
		author: {
			personal_info: {},
		},
	},
});

export default blogAtom;
