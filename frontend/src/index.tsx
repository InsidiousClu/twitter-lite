import 'normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ReduxBundlerProvider } from 'redux-bundler-hook';
import { ThemeProvider } from 'styled-components';

import App from './App';
import { ToastProvider } from './dataViews/Toast';
import GlobalStyles, { theme } from './common/globalStyles';
import createStore from './bundles';

import * as serviceWorker from './serviceWorker';
import ModalProvider from './dataViews/Modal/ModalProvider';

const store = createStore();

ReactDOM.render(
	<ReduxBundlerProvider store={store}>
		<ThemeProvider theme={theme}>
			<ModalProvider>
				<ToastProvider duration={3500}>
					<App />
					<GlobalStyles />
				</ToastProvider>
			</ModalProvider>
		</ThemeProvider>
	</ReduxBundlerProvider>,
	document.getElementById('root')
);
serviceWorker.unregister();
