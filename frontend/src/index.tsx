import React from 'react';
import { ReduxBundlerProvider } from 'redux-bundler-hook';
import ReactDOM from 'react-dom';

import App from './App';
import createStore from './bundles';
import * as serviceWorker from './serviceWorker';

const store = createStore();

ReactDOM.render(
	<ReduxBundlerProvider store={store}>
		<App />
	</ReduxBundlerProvider>,
	document.getElementById('root')
);
serviceWorker.unregister();
