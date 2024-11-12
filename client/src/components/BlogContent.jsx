export default function BlogContent({ content }) {
	const { type, data } = content;

	const Img = ({ src, alt, caption }) => {
		return (
			<div className="flex flex-col items-center justify-center">
				<img src={src} alt={alt} className="max-w-[75%]" />
				{caption !== '' && (
					<p className="w-full text-center my-3 md:mb-12 text-base  bg-grey/30 max-w-[75%] md:w-[75%] text-dark-grey">
						{caption}
					</p>
				)}
			</div>
		);
	};

	if (type === 'paragraph') {
		return <p dangerouslySetInnerHTML={{ __html: data.text }} className=""></p>;
	} else if (type === 'image') {
		return (
			<div>
				<Img src={data.file.url} alt={data.caption} caption={data?.caption} />
			</div>
		);
	} else if (type === 'list') {
		if (data.style === 'ordered') {
			return (
				<ol className="list-decimal">
					{data.items.map((item, index) => (
						<li
							key={index}
							className="my-4"
							dangerouslySetInnerHTML={{ __html: item }}
						></li>
					))}
				</ol>
			);
		} else {
			return (
				<ul className="list-disc">
					{data.items.map((item, index) => (
						<li
							key={index}
							className="my-4"
							dangerouslySetInnerHTML={{ __html: item }}
						></li>
					))}
				</ul>
			);
		}
	} else if (type === 'header') {
		if (data.level === 1)
			return (
				<h1
					className="text-xl font-bold"
					dangerouslySetInnerHTML={{ __html: data.text }}
				></h1>
			);
		else if (data.level === 2)
			return (
				<h2
					className="text-2xl font-bold"
					dangerouslySetInnerHTML={{ __html: data.text }}
				></h2>
			);
		else if (data.level === 3)
			return (
				<h3
					className="text-3xl font-bold"
					dangerouslySetInnerHTML={{ __html: data.text }}
				></h3>
			);
	} else if (type === 'inline-code') {
		return (
			<p
				dangerouslySetInnerHTML={{ __html: data.text }}
				className="text-[0.86em] important"
			></p>
		);
	} else if (type === 'embed') {
		return (
			<div className="flex flex-col items-center justify-center">
				<iframe
					className="aspect-video w-[90%] md:w-[75%]"
					src={data.embed}
					title={data.caption}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
				></iframe>
				{data.caption !== '' && (
					<p className="w-[90%] text-center my-3 md:mb-12 text-base md:w-[75%] bg-grey/30 text-dark-grey">
						{data.caption}
					</p>
				)}
			</div>
		);
	}
}
