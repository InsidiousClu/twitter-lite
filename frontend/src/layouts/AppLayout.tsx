import React, { ReactChild, ReactElement } from 'react';
import { useTransition, animated } from 'react-spring';
import styled from 'styled-components';

type Props = {
	children: ReactElement[];
	routeId: string;
};

const AppLayoutContainer = styled(animated.div)`
	display: grid;
	height: 100vh;
	width: 100vw;
	background-color: ${props => props.theme.colors.dark_blue};
`;

export default function AppLayout({ children, routeId }: Props): any {
	const transition = useTransition(routeId, null, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 }
	});

	return transition.map(({ key, props }) => (
		<AppLayoutContainer key={key} style={props}>
			{children}
		</AppLayoutContainer>
	));
}
