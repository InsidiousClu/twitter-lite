import React, { ReactElement, useEffect, useState } from 'react';
import { useConnect } from 'redux-bundler-hook';
import styled from 'styled-components';
import { useSpring, animated, to, config } from 'react-spring';

import Tweet from '../../dataViews/Tweet';
import { Header, Drawer } from '../../layouts';

const Content = styled.div`
	margin-top: 75px;
	padding: 1rem 2rem;
	min-height: 90vh;
`;
const ContentInner = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 1rem;
	grid-row-gap: 1rem;
	height: 100%;
`;

export default function Dashboard(): ReactElement | null {
	const { isUserAuthenticated, currentUser, myTweets, doUserSelect } = useConnect(
		'selectIsUserAuthenticated',
		'selectCurrentUser',
		'selectMyTweets',
		'doUserSelect'
	);
	const [isDrawerOpen, handleDrawerStateChange] = useState<boolean>(false);
	const [{ width }, set] = useSpring(() => ({ width: 0, config: { duration: 0 } }));

	useEffect(() => {
		set({ width: isDrawerOpen ? 400 : 0, config: config.default });
	}, [isDrawerOpen]);

	const handleSearchedUserSelect = (username: string): void => {
		doUserSelect(username);
		if (!isDrawerOpen) {
			handleDrawerStateChange(true);
		}
	};

	if (!isUserAuthenticated) {
		return null;
	}

	return (
		<>
			<animated.div style={{ width: to(width, w => `calc(100% - ${w}px)`) }}>
				<Header onSearchSelect={handleSearchedUserSelect} />
				<Content>
					<ContentInner>
						{myTweets.map(item => (
							<Tweet {...currentUser} key={item.id} {...item} />
						))}
					</ContentInner>
				</Content>
			</animated.div>
			<Drawer position="right" isDrawerOpen={isDrawerOpen} />
		</>
	);
}
