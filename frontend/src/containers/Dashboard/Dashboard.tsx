import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useConnect } from 'redux-bundler-hook';
import { Form } from 'react-final-form';
import styled from 'styled-components';
import { useSpring, animated, to, config } from 'react-spring';

import Tweet from '../../dataViews/Tweet';
import { Header, Drawer } from '../../layouts';
import { Flex, Text } from '../../common/primitives';
import { Button, TextInput } from '../../controls';

import { ToastContext } from '../../dataViews/Toast';
import { ToastContextType } from '../../dataViews/Toast/ToastContext';

const Content = styled.div`
	margin-top: 75px;
	padding: 1rem 2rem;
	background-color: ${props => props.theme.colors.dark_blue};
	min-height: 90vh;
`;
const ContentInner = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 1rem;
	grid-row-gap: 1rem;
`;

export default function Dashboard(): ReactElement | null {
	const { isUserAuthenticated, currentUser, myTweets, doMyTweetSubmit } = useConnect(
		'selectIsUserAuthenticated',
		'selectCurrentUser',
		'selectMyTweets',
		'doMyTweetSubmit'
	);
	const { handleToastAdd } = useContext<ToastContextType>(ToastContext);
	const [isDrawerOpen, handleDrawerStateChange] = useState<boolean>(false);
	const [{ width }, set] = useSpring(() => ({ width: 100 }));

	useEffect(() => {
		set({ width: isDrawerOpen ? 400 : 0, config: config.default });
	}, [isDrawerOpen]);

	const handleTweetSubmit = ({ tweet }) => {
		if (tweet && tweet.length && tweet.length < 180) {
			doMyTweetSubmit(tweet);
		} else {
			handleToastAdd({
				type: 'error',
				toast: <Text color="white">Tweet should be less than 180 symbols</Text>
			});
		}
	};

	const renderTweetForm = (): ReactElement => (
		<Form onSubmit={handleTweetSubmit}>
			{({ handleSubmit, submitting }) => (
				<form onSubmit={handleSubmit} className="mb-1 w-50">
					<Flex>
						<TextInput placeholder="What's on your mind?" className="mr-1" name="tweet" />
						<Button disabled={submitting} type="submit" className="mb-1 h-100">
							Submit
						</Button>
					</Flex>
				</form>
			)}
		</Form>
	);

	if (!isUserAuthenticated) {
		return null;
	}

	return (
		<>
			<animated.div style={{ width: to(width, w => `calc(100% - ${w}px)`) }}>
				<Header />
				<Content>
					{renderTweetForm()}
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
