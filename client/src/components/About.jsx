import { Link } from 'react-router-dom';
import formatDate from '../common/date';

export default function AboutUser({ className, bio, joinedAt, socials }) {
	return (
		<div className={'md:w-[90%] md:mt-7 ' + className}>
			<p className="text-xl leading-7">
				{bio.length ? bio : 'Nothing to read here'}
			</p>
			<div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey ">
				{Object.keys(socials).map((key) => {
					return socials[key] ? (
						<Link to={socials[key]} key={key} target="_blank">
							<i
								className={
									'fi ' +
									(key !== 'website' ? `fi-brands-${key}` : 'fi-rr-globe')
								}
							></i>
						</Link>
					) : (
						''
					);
				})}
			</div>
			<p className="leading-7 text-xl text-dark-grey -my-1">
				Joined on {formatDate(joinedAt)}
			</p>
		</div>
	);
}
