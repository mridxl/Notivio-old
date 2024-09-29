import { unsecureApi } from '../../api/api';

const uploadCloudinaryImage = async (file) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append(
		'upload_preset',
		import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
	);
	try {
		const response = await unsecureApi.post(
			import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
			formData
		);
		return response.data.secure_url;
	} catch (error) {
		console.log(error);
		return null;
	}
};
export default uploadCloudinaryImage;
