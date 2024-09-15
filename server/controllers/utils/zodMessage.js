export default (parsedPayload) => {
	return parsedPayload.error.issues.map((issue) => issue.message);
};
