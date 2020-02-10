import { createContext, ReactElement } from 'react';

export type ModalContextType = {
	content: ReactElement | null;
	isModalOpen: boolean;
	handleModalClose: () => void;
	handleModalOpen: (child: ReactElement  | null) => void;
};

export default createContext<ModalContextType>({
	content: null,
	isModalOpen: false,
	handleModalClose() {},
	handleModalOpen(child: ReactElement  | null) {}
});
