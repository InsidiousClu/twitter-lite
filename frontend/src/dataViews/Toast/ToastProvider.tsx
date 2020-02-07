import React, { FunctionComponent, ReactElement, useState } from 'react';
import uuidv4 from 'uuid/v4';
import ToastContext, { ToastParams, ToastType } from './ToastContext';

type Props = {
	children?: ReactElement[];
	duration?: number;
};

const BASE_GAP = 120;

export default function ToastProvider({ children, duration = 3000 }: Props): ReactElement {
	const [listItems, handleItemsChange] = useState<Array<ToastParams>>([]);

	const handleToastAdd = ({ type, toast }: { type: ToastType; toast: string | FunctionComponent }) => {
		handleItemsChange((prevState: Array<ToastParams>) => {
			return [
				{ key: uuidv4(), toast, posY: 0, type },
				...prevState.map((item, i) => ({ ...item, posY: (i + 1) * BASE_GAP }))
			];
		});
	};

	const removeToastNode = id => {
		handleItemsChange(prevState => prevState.filter(item => item.key !== id));
	};

	return (
		<ToastContext.Provider value={{ toastList: listItems, duration, handleToastAdd, removeToastNode }}>
			{children}
		</ToastContext.Provider>
	);
}
