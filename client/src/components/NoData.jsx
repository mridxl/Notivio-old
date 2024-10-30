import AnimationWrapper from '../common/pageAnimation';

const NoData = ({ message }) => {
	return (
		<AnimationWrapper>
			<div className="text-center w-full p-4 rounded-full bg-grey/40 mt-4 ">
				{message}
			</div>
		</AnimationWrapper>
	);
};

export default NoData;
