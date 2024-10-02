// importing tools
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';

import uploadCloudinaryImage from './cloudinary';

const uploadImageByUrl = async (e) => {
	const link = new Promise((resolve, reject) => {
		try {
			resolve(e);
		} catch (error) {
			reject(error);
		}
	});
	return link.then((url) => {
		return {
			success: true,
			file: { url },
		};
	});
};

async function uploadImageByFile(e) {
	return uploadCloudinaryImage(e).then((url) => {
		if (!url) {
			throw new Error('No URL returned from Cloudinary');
		}
		return {
			success: true,
			file: { url },
		};
	});
}

export default {
	embed: Embed,
	list: {
		class: List,
		inlineToolbar: true,
	},
	image: {
		class: Image,
		config: {
			uploader: {
				uploadByUrl: uploadImageByUrl,
				uploadByFile: uploadImageByFile,
			},
			captionPlaceholder: 'Type caption (optional)',
		},
	},
	header: {
		class: Header,
		config: {
			placeholder: 'Enter a header',
			levels: [2, 3, 4],
			defaultLevel: 3,
		},
	},
	quote: {
		class: Quote,
		inlineToolbar: true,
	},
	marker: Marker,
	inlineCode: InlineCode,
	table: Table,
	delimiter: Delimiter,
};
