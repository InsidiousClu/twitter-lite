import React, { ReactElement, Suspense } from 'react';
import { useConnect } from 'redux-bundler-hook';
import { AppLayout } from './layouts';
import ToastList from './dataViews/Toast/ToastConsumer';
import styled from 'styled-components';

const AppContainer = styled.div`
	display: grid;
	height: 100%;
	width: 100%;
	overflow-x: hidden;
`;

export default function App(): ReactElement {
	const {
		route: { Component, routeId }
	} = useConnect('selectRoute');

	return (
		<AppContainer>
			<AppLayout routeId={routeId}>
				<Suspense fallback={<div>loading...</div>}>
					<Component />
				</Suspense>
				<ToastList />
			</AppLayout>
		</AppContainer>
	);
}