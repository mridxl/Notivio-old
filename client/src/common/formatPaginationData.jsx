export default function formatPaginationData({
	currentState,
	newData,
	page,
	limit,
}) {
	let obj;
	const hasMore = newData.length === limit;

	if (currentState != null) {
		obj = {
			page: page,
			results: [...currentState.results, ...newData],
			hasMore: hasMore,
		};
	} else {
		obj = {
			page: page,
			results: newData,
			hasMore: hasMore,
		};
	}

	return obj;
}
