export default function LoadMoreBtn({ state, fetchFunction }) {
	if (state === null || state.hasMore === false) return null;
	return (
		<button
			className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
			onClick={() => {
				fetchFunction(state.page + 1);
			}}
		>
			Load More
		</button>
	);
}
