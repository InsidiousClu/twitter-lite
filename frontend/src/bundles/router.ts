import { createRouteBundle } from 'redux-bundler';
import React, { lazy } from 'react';

const Dashboard = lazy(() => import('../containers/Dashboard'));
const Auth = lazy(() => import('../containers/Auth'));

type Route = {
	Component: React.FunctionComponent,
	routeId: string,
	pathname: string
}

const routes: Array<Route> = [
	{ Component: Dashboard, pathname: '/', routeId: 'dashboard' },
	{ Component: Auth, pathname: '/auth', routeId: 'auth' },
];

export default createRouteBundle(
	routes.reduce((hash, item) => {
		hash[item.pathname] = item;
		return hash;
	}, {})
)