export default function formatPaginationData({
	currentState,
	newData,
	page,
	limit,
	createNew = false,
}) {
	const hasMore = newData.length === limit;

	if (createNew || currentState === null) {
		return {
			page,
			results: newData,
			hasMore,
		};
	}

	return {
		page,
		results: [...currentState.results, ...newData],
		hasMore,
	};
}
