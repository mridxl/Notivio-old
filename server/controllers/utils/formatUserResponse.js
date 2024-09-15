export default (User) => {
	return {
		profile_img: User.personal_info.profile_img,
		username: User.personal_info.username,
		fullname: User.personal_info.fullname,
	};
};
