import { createContext } from 'react';

export type ToastType = 'error' | 'success' | 'common';

export type ToastParams = {
	key: string;
	toast: any;
	posY: number;
	type: ToastType;
};

export type ToastContextType = {
	toastList: Array<ToastParams>;
	duration: number;
	handleToastAdd: ({ type, toast }: { type: ToastType; toast: any }) => void;
	removeToastNode: (id: string) => void;
};

const ToastContext = createContext<ToastContextType>({
	toastList: [],
	duration: 3000,
	handleToastAdd: () => {},
	removeToastNode: (id: string) => {}
});

export default ToastContext;
