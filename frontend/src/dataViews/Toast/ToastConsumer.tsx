import React, { useContext } from 'react';
import ToastContext, { ToastContextType } from './ToastContext';
import Toast from './Toast';

export default function ToastList(): any {
	const { toastList } = useContext<ToastContextType>(ToastContext);
	return toastList.map(({ key, toast, posY, type }) => {
		return (
			<Toast type={type} id={key} key={key} toYPos={posY}>
				{toast}
			</Toast>
		);
	});
}
