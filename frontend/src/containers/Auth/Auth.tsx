import React, { ReactElement, useContext, useState } from 'react';
import { Form } from 'react-final-form';
import { useConnect } from 'redux-bundler-hook';
import styled from 'styled-components';

import { Flex, TwitterIcon, Text } from '../../common/primitives';
import { TextInput, Button } from '../../controls';
import { ToastContextType } from '../../dataViews/Toast/ToastContext';
import { ToastContext } from '../../dataViews/Toast';

const AuthForm = styled.form`
	background-color: white;
	width: 350px;
	padding: 0 1.5rem;
	height: 350px;
	border-radius: 5px;
	box-shadow: 0 1px 14px -4px rgba(255, 255, 255, 1);
`;

export default function Auth(): ReactElement {
	const { doUserSignIn, doUserRegister, doUpdateUrl, isUserFetching } = useConnect(
		'doUserSignIn',
		'doUserRegister',
		'doUpdateUrl',
		'selectIsUserFetching'
	);
	const [isSignUp, handleFormStateChange] = useState(false);
	const { handleToastAdd } = useContext<ToastContextType>(ToastContext);

	const handleFormSubmit = values => {
		if (isSignUp) {
			doUserSignIn(values, displayErrorMessage, () => doUpdateUrl('/'));
			return;
		}
		doUserRegister(values, displayErrorMessage, () => doUpdateUrl('/'));
	};

	const displayErrorMessage = (message: string) => {
		handleToastAdd({
			type: 'error',
			toast: (
				<Text fontSize={20} color="white">
					{message}
				</Text>
			)
		});
	};

	const handleFormToggle = () => {
		handleFormStateChange(!isSignUp);
	};

	return (
		<Flex flexDirection="column" alignItems="center" justifyContent="center" className="h-100">
			<TwitterIcon className="mt-negative-2" />
			<Form
				onSubmit={handleFormSubmit}
				render={({ handleSubmit, submitting }) => (
					<AuthForm onSubmit={handleSubmit}>
						<Flex className="h-100" flexDirection="column" justifyContent="space-around">
							<h1 className="m-0">{isSignUp ? 'Register' : 'Sign In'}</h1>
							<Flex flexDirection="column" justifyContent="center">
								<TextInput className="mv-1" placeholder="Username" name="email" type="email" />
								<TextInput className="mv-1" placeholder="Password" name="password" type="password" />
							</Flex>
							<Flex alignSelf="center">
								<Button type="submit" disabled={submitting || isUserFetching}>
									Submit
								</Button>
							</Flex>
						</Flex>
					</AuthForm>
				)}
			/>
			<Button onClick={handleFormToggle} className="mt-4 pv-1">
				{isSignUp ? 'Already registered? Sign In' : "Don't have an account? Register"}
			</Button>
		</Flex>
	);
}
