import { Link } from 'react-router-dom';
import notFoundImage from '../imgs/404.jpg';
import fullLogo from '../imgs/full-logo.png';

export default function PageNotFound() {
	return (
		<section className="relative h-cover p-10 flex flex-col items-center gap-20 text-center">
			<img
				src={notFoundImage}
				className="select-none pointer-events-none w-72 aspect-square object-cover"
			/>
			<h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
			<p className="text-xl leading-7 -mt-8 text-dark-grey">
				The page you are looking for does not exist or has been moved. Head back
				to the{' '}
				<Link to="/" className="text-black underline text-xl">
					home page
				</Link>
				.
			</p>

			<div className="mt-auto">
				<img
					src={fullLogo}
					className="h-8 object-contain block mx-auto select-none pointer-events-none"
				/>
				<p className="mt-5 text-dark-grey">
					Share noteworthy ideas with the world.
				</p>
			</div>
		</section>
	);
}
