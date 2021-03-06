import React, { ReactElement, Suspense } from 'react';
import { useConnect } from 'redux-bundler-hook';
import { AppLayout } from './layouts';
import ToastList from './dataViews/Toast/ToastConsumer';

export default function App(): ReactElement {
	const {
		route: { Component, routeId }
	} = useConnect('selectRoute');

	return (
		<AppLayout routeId={routeId}>
			<Suspense fallback={<div>loading...</div>}>
				<Component />
			</Suspense>
			<ToastList />
		</AppLayout>
	);
}
