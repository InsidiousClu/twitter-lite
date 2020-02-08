import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useConnect } from 'redux-bundler-hook';
import styled from 'styled-components';
import { useSpring, animated, interpolate, config } from 'react-spring';

import { Header, Drawer } from '../../layouts';

const Content = styled.div`
	margin-top: 75px;
`;

export default function Dashboard(): ReactElement | null {
	const { isUserAuthenticated, currentUser, doSessionUpdate, doFetchMyTweets, myTweets } = useConnect(
		'doSessionUpdate',
		'doFetchMyTweets',
		'selectIsUserAuthenticated',
		'selectCurrentUser',
		'selectMyTweets'
	);
	const [isDrawerOpen, handleDrawerStateChange] = useState<boolean>(false);
	const [{ width }, set] = useSpring(() => ({ width: 100, config: { ...config.default, duration: 150 } }));

	useEffect(() => {
		set({ width: isDrawerOpen ? 400 : 0, delay: isDrawerOpen ? 400 : 0 });
	}, [isDrawerOpen]);

	if (!isUserAuthenticated) {
		return null;
	}

	console.log(myTweets);

	return (
		<>
			<animated.div style={{ width: interpolate(width, w => `calc(100% - ${w}px)`) }}>
				<Header />
				<Content>
					<button onClick={doSessionUpdate}>CLICK CLACK</button>
				</Content>
			</animated.div>
			<Drawer position="right" isDrawerOpen={isDrawerOpen} />
		</>
	);
}
