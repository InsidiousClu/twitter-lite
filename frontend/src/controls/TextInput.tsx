import React, { ReactElement } from 'react';
import { Field } from 'react-final-form';
import styled from 'styled-components';

type Props = {
	name: string;
	type?: string;
	placeholder?: string;
	className?: string;
	backgroundColor?: string;
};

const Input = styled(Field)`
	height: 35px;
	border: none;
	width: 100%;
	background-color: ${props => props.theme.colors[props.backgroundColor || 'twitter_blue']};
	color: white;
	padding-left: 0.5rem;
	border-radius: 8px;
	&::placeholder {
		color: white;
	}
`;

export default function TextInput(props: Props): ReactElement {
	return <Input {...props} component="input" />;
}
