// importing tools
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Header from '@editorjs/header';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Delimiter from '@editorjs/delimiter';

import uploadCloudinaryImage from './cloudinary';

const uploadImageByUrl = async (e) => {
	const fallback =
		'https://learn.getgrav.org/user/pages/11.troubleshooting/01.page-not-found/error-404.png';

	function isValidImageUrl(url) {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = function () {
				resolve(true);
			};
			img.onerror = function () {
				resolve(false);
			};
			img.src = url;
		});
	}
	const link = new Promise((resolve, reject) => {
		try {
			isValidImageUrl(e).then((valid) => {
				if (valid) {
					resolve(e);
				} else {
					resolve(fallback);
				}
			});
		} catch (error) {
			resolve(fallback);
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
		class: ImageTool,
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
			levels: [1, 2, 3],
			defaultLevel: 2,
		},
	},
	marker: Marker,
	inlineCode: InlineCode,
	delimiter: Delimiter,
};
