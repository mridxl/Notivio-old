export default (title) => {
	return (
		title
			.replace(/[^a-zA-Z0-9]/g, ' ')
			.replace(/\s+/g, '-')
			.trim()
			.toLowerCase() +
		'-' +
		Date.now().toString(36)
	);
};
