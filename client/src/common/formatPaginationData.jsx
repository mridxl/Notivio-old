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
	if (page === currentState.page) return currentState;

	return {
		page,
		results: [...currentState.results, ...newData],
		hasMore,
	};
}
