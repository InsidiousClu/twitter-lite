import React, { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated, interpolate, config } from 'react-spring';
import { Flex, TwitterIcon } from '../common/primitives';

import Clock from './Clock';

const HeaderContainer = styled(animated.div)`
	height: 75px;
	background: ${props => props.theme.colors.blue};
	border-bottom: 1px solid ${props => props.theme.colors.twitter_border};
	padding: 0 2rem;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	.icon_w {
		width: 50px;
	}
`;

export default function Header(): ReactElement {
	const { y } = useSpring({ from: { y: -300 }, to: { y: 0 } });

	return (
		<HeaderContainer
			style={{
				transform: interpolate(y, yAxis => `translate3d(0, ${yAxis}px, 0)`)
			}}
		>
			<Flex className="h-100 w-100" justifyContent="space-between" alignItems="center">
				<TwitterIcon className="icon_w h-100" unit="%" height="100" width="100" />
				<Clock />
			</Flex>
		</HeaderContainer>
	);
}
