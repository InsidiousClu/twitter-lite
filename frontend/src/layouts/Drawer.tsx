import React, { ReactChild, ReactChildren, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';

type Position = 'left' | 'right';

type Props = {
	position?: Position;
	children?: ReactChild | ReactChildren;
	isDrawerOpen: boolean;
};

const DrawerContainer = styled(animated.div)<{ position: Position }>`
	height: 100vh;
	width: 400px;
	position: absolute;
	top: 75px;
	border: 1px solid ${props => props.theme.colors.twitter_border};
	background: ${props => props.theme.colors.blue};
	${props => `${props.position}: 0px`};
`;

const resolveDrawerPositionXAxis = (pos: Position): number =>
	(pos === 'left' ? -window.innerWidth : window.innerWidth) / 3;

export default function Drawer({ position = 'left', children, isDrawerOpen }: Props): ReactElement {
	const [{ x }, set] = useSpring(() => ({ x: -resolveDrawerPositionXAxis(position), config: {} }));

	useEffect(() => {
		set({ x: !isDrawerOpen ? -resolveDrawerPositionXAxis(position) : 0 });
	}, [isDrawerOpen]);

	return (
		<DrawerContainer position={position} style={{ [position]: x.interpolate(xAxis => `${xAxis}px`) }}>
			{children}
		</DrawerContainer>
	);
}
