import { useEffect, useRef, useState } from 'react';

export let activeTabRef;
export default function InpageNavigation({
	routes,
	defaultHidden = [],
	defaultIndex = 0,
	children,
}) {
	const [inpageNavIndex, setInpageNavIndex] = useState(defaultIndex);
	const tabLineRef = useRef();
	activeTabRef = useRef();

	function changePageState(btn, i) {
		const { offsetWidth, offsetLeft } = btn;
		tabLineRef.current.style.width = `${offsetWidth}px`;
		tabLineRef.current.style.left = `${offsetLeft}px`;
		setInpageNavIndex(i);
	}

	useEffect(() => changePageState(activeTabRef.current, defaultIndex), []);

	return (
		<>
			<div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
				{routes.map((route, i) => (
					<button
						key={i}
						ref={i === defaultIndex ? activeTabRef : null}
						className={
							'p-4 px-5 capitalize ' +
							(i === inpageNavIndex ? 'text-black ' : 'text-dark-grey ') +
							(defaultHidden.includes(route) ? 'md:hidden' : '')
						}
						onClick={(e) => changePageState(e.target, i)}
					>
						{route}
					</button>
				))}
				<hr ref={tabLineRef} className="absolute bottom-0 duration-300 " />
			</div>
			<div key={inpageNavIndex}>
				{Array.isArray(children) ? children[inpageNavIndex] : children}
			</div>
		</>
	);
}
