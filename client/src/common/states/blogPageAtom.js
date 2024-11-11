import { atom } from 'recoil';

export const blogStructure = {
	activity: {
		total_likes: 0,
		total_comments: 0,
	},
	author: {
		personal_info: {
			fullname: '',
			profile_img: '',
			username: '',
		},
	},
	banner: '',
	blog_id: '',
	content: [],
	des: '',
	publishedAt: '',
	tags: [],
	title: '',
};

const blogPageAtom = atom({
	key: 'blogPageAtom',
	default: blogStructure,
});

export default blogPageAtom;
