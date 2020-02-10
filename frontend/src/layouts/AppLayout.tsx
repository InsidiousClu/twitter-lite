import React, { ReactElement } from 'react';
import styled from 'styled-components';

type Props = {
	children: ReactElement[];
	routeId: string;
};

const AppLayoutContainer = styled.div`
	width: 100%;
	height: 100%;
	min-height: 100vh;
	display: grid;
`;

export default function AppLayout({ children, routeId }: Props): ReactElement {
	return <AppLayoutContainer key={routeId}>{children}</AppLayoutContainer>;
}
