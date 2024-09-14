import { AnimatePresence, motion } from 'framer-motion';

function AnimationWrapper({
	children,
	initial = { opacity: 0 },
	animate = { opacity: 1 },
	transition = { duration: 0.6 },
	keyvalue,
	className,
}) {
	return (
		<AnimatePresence>
			<motion.div
				key={keyvalue}
				initial={initial}
				animate={animate}
				transition={transition}
				className={className}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}

export default AnimationWrapper;
