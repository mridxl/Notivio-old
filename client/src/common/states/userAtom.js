import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
	key: 'recoil-persist',
	storage: localStorage,
});

const userAtom = atom({
	key: 'userAtom',
	default: {
		isAuth: false,
		user: null,
	},
	effects_UNSTABLE: [persistAtom], // persist the state across reloads
});

export default userAtom;
