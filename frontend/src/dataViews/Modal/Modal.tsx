import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

const FixedContainer = styled.div<{ isVisible: boolean }>`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	${props => `z-index: ${props.isVisible ? 5 : -1}`}
`;
const ModalContainer = styled(animated.div)`
	z-index: 9999;
	width: 400px;
	height: 350px;
	background-color: white;
	border-radius: 7px;
	padding: 1rem 1.35rem;
`;
const ModalOverlay = styled(animated.div)`
	background-color: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100%;
	position: fixed;
`;

type Props = {
	children: ReactElement | null;
	onModalClose: () => void;
	isVisible: boolean;
};

const INITIAL_ANIMATION_STATE = { opacity: 0, y: -500, overlay: 0 };

export default function Modal({ children, onModalClose, isVisible }: Props): ReactElement {
	const [{ y, opacity, overlay }, set] = useSpring(() => INITIAL_ANIMATION_STATE);

	useEffect(() => {
		set(
			isVisible ? { y: 0, opacity: 1, overlay: 1 } : { ...INITIAL_ANIMATION_STATE, config: { duration: 0 } }
		);
	}, [isVisible]);

	return (
		<FixedContainer isVisible={isVisible}>
			<ModalContainer style={{ opacity: opacity, transform: y.to(yAxis => `translate3d(0, ${yAxis}px, 0)`) }}>
				{children}
			</ModalContainer>
			<ModalOverlay onClick={onModalClose} style={{ opacity: overlay }} />
		</FixedContainer>
	);
}
