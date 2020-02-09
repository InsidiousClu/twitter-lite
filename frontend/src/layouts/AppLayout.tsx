import React, { ReactElement } from 'react';
import { useTransition, animated, config } from 'react-spring';
import styled from 'styled-components';

type Props = {
	children: ReactElement[];
	routeId: string;
};

// spring@next version, meh
const AppLayoutContainer = styled(animated.div)<any>`
	width: 100%;
	height: 100%;
	background-color: ${props => props.theme.colors.dark_blue};
	overflow-x: hidden;
`;

export default function AppLayout({ children, routeId }: Props): any {
	const transition = useTransition(routeId, null, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: {
			...config.default,
			duration: 500,
			delay: 350
		}
	});

	return transition.map(({ key, props }) => (
		<AppLayoutContainer key={key} style={props}>
			<div className="w-100 h-100">{children}</div>
		</AppLayoutContainer>
	));
}
