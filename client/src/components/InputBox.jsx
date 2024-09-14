import { useState } from 'react';

function InputBox({ name, type, id, value, placeholder, icon }) {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="relative w-[100%] mb-4">
			<input
				name={name}
				type={type === 'password' && showPassword ? 'text' : type}
				placeholder={placeholder}
				id={id}
				defaultValue={value}
				className="input-box"
			/>
			<i className={'fi ' + icon + ' input-icon'}></i>
			{type === 'password' ? (
				<i
					className={
						'fi fi-rr-eye' +
						(showPassword ? '-crossed' : '') +
						' input-icon left-auto right-4 cursor-pointer'
					}
					onClick={() => setShowPassword((s) => !s)}
				></i>
			) : (
				''
			)}
		</div>
	);
}

export default InputBox;
