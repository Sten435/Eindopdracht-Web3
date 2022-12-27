import React from 'react';

const InputText = ({ placeholder, maxLength, minLength, referace }) => {
	return <input placeholder={placeholder} maxLength={maxLength} minLength={minLength} ref={referace} className="inputText" type="text" />;
};

export default InputText;
