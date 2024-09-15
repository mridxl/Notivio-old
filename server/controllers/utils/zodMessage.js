export default (parsedPayload) => {
	const errorMessage = parsedPayload.error.issues.map((issue) => issue.message);
	if (errorMessage[0] == 'Required') {
		return 'Invalid payload';
	}
	return errorMessage;
};
