import React, { ReactElement, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';
import { useScale } from '../common/hooks';

type Props = {
	type?: string;
	children: string;
	className?: string;
	disabled?: boolean;
	onClick?: (e: SyntheticEvent<MouseEvent>) => any;
};

const StyledButton = styled(animated.button)<any>`
	min-height: 35px;
	min-width: 150px;
	color: white;
	background-color: ${props => props.theme.colors.twitter_blue};
	border-radius: 8px;
	border-color: transparent;
	transition: all 0.3s;
	cursor: pointer;
	outline: none;
	&:hover {
		background-color: ${props => props.theme.colors.blue};
	}
`;

export default function Button({
	children,
	type = 'button',
	className,
	onClick = () => {},
	disabled
}: Props): ReactElement {
	const { handleMouseOver, handleMouseLeave, scale } = useScale({
		initialScale: 1,
		toScale: 1.15,
		config: { duration: 50 }
	});

	return (
		<StyledButton
			type={type}
			className={className}
			disabled={disabled}
			onClick={onClick}
			style={{ transform: scale.interpolate(sc => `scale(${sc})`) }}
			onMouseOver={handleMouseOver}
			onMouseLeave={handleMouseLeave}
		>
			{children}
		</StyledButton>
	);
}
