import { Link } from 'react-router-dom';
import logo from '../imgs/logo.png';
import defaultBanner from '../imgs/blog-banner.png';
import AnimationWrapper from '../common/pageAnimation';

export default function BlogEditor() {
	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-10 md:w-12">
					<img src={logo} alt="logo" className="w-full" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full text-xl pt-1">
					New Title
				</p>
				<div className="flex ml-auto gap-4">
					<button className="btn-dark py-2">Publish</button>
					<button className="btn-light py-2">Save Draft</button>
				</div>
			</nav>
			<AnimationWrapper keyvalue>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
						<div className="relative aspect-video bg-white border-4 border-grey rounded-xl hover:opacity-80">
							<label htmlFor="uploadBanner">
								<img src={defaultBanner} className="z-20" />
								<input
									id="uploadBanner"
									type="file"
									accept=".png, .jpg, .jpeg"
									hidden
									onChange={(e) => {
										const file = e.target.files[0];
									}}
								/>
							</label>
						</div>
					</div>
				</section>
			</AnimationWrapper>
		</>
	);
}
