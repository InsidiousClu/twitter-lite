import React, { ReactElement, useContext } from 'react';
import { useConnect } from 'redux-bundler-hook';
import styled from 'styled-components';
import { useSpring, animated, interpolate } from 'react-spring';
import { Form } from 'react-final-form';

import Clock from './Clock';
import SearchBar from '../controls/SearchBar';
import { Flex, Text, TwitterIcon } from '../common/primitives';
import { Button, TextInput } from '../controls';

import ModalContext, { ModalContextType } from '../dataViews/Modal/ModalContext';
import { ToastContextType } from '../dataViews/Toast/ToastContext';
import { ToastContext } from '../dataViews/Toast';

const HeaderContainer = styled(animated.div)`
	height: 75px;
	background: ${props => props.theme.colors.blue};
	border-bottom: 1px solid ${props => props.theme.colors.twitter_border};
	padding: 0 2rem;
	z-index: 1;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	.icon_w {
		width: 50px;
	}
`;

export default function Header({ onSearchSelect }): ReactElement {
	const { y } = useSpring({ from: { y: -300 }, to: { y: 0 } });
	const { doMyTweetSubmit } = useConnect('doMyTweetSubmit');
	const { handleModalOpen, handleModalClose } = useContext<ModalContextType>(ModalContext);
	const { handleToastAdd } = useContext<ToastContextType>(ToastContext);

	const handleTweetSubmit = ({ tweet }) => {
		if (tweet && tweet.length && tweet.length < 180) {
			doMyTweetSubmit(tweet);
			handleModalClose()
		} else {
			handleToastAdd({
				type: 'error',
				toast: <Text color="white">Tweet should be less than 180 symbols</Text>
			});
		}
	};

	const renderTweetForm = (): ReactElement => (
		<Flex className="h-100 w-100">
			<Form onSubmit={handleTweetSubmit}>
				{({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit} className="w-100 h-100">
						<Flex
							alignItems="center"
							justifyContent="space-between"
							className="h-100 w-100"
							flexDirection="column"
						>
							<TextInput className="h-85" component="textarea" placeholder="What's on your mind?" name="tweet" />
							<Button className="align-self-end" disabled={submitting} type="submit">
								Submit
							</Button>
						</Flex>
					</form>
				)}
			</Form>
		</Flex>
	);

	return (
		<HeaderContainer
			style={{
				transform: interpolate(y, yAxis => `translate3d(0, ${yAxis}px, 0)`)
			}}
		>
			<Flex className="h-100 w-100" justifyContent="space-between" alignItems="center">
				<TwitterIcon className="icon_w h-100" unit="%" height="100" width="100" />
				<SearchBar onUserSelect={onSearchSelect} />
				<div className="d-flex h-100 align-items-center">
					<Clock />
					<Button onClick={() => handleModalOpen(renderTweetForm())}>Tweet!</Button>
				</div>
			</Flex>
		</HeaderContainer>
	);
}
