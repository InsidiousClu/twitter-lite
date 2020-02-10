import React, { ReactChild, ReactElement, useState } from 'react';
import ModalContext from './ModalContext';
import Modal from './Modal';

const INITIAL_STATE = { isModalOpen: false, content: null };

type Props = {
	children: ReactChild;
};
type State = {
	content: ReactElement | null;
	isModalOpen: boolean;
};

export default function ModalProvider({ children }: Props): ReactElement {
	const [{ isModalOpen, content }, handleModalStateChange] = useState<State>(INITIAL_STATE);

	const handleModalClose = () => {
		handleModalStateChange(INITIAL_STATE);
	};

	const handleModalOpen = (content: ReactElement | null) => {
		handleModalStateChange({ isModalOpen: true, content });
	};

	return (
		<ModalContext.Provider value={{ isModalOpen, content, handleModalClose, handleModalOpen }}>
			{children}
			<Modal isVisible={isModalOpen} onModalClose={handleModalClose}>
				{content}
			</Modal>
		</ModalContext.Provider>
	);
}
