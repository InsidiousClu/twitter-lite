import React, { ReactElement } from 'react';
import { Field } from 'react-final-form';
import styled, { css } from 'styled-components';

type Props = {
	name: string;
	type?: string;
	placeholder?: string;
	className?: string;
	backgroundColor?: string;
	component?: 'input' | 'textarea';
};

const styles = props => css`
	height: 35px;
	border: none;
	width: 100%;
	background-color: ${props.theme.colors[props.backgroundColor || 'twitter_blue']};
	color: white;
	padding-left: 0.5rem;
	border-radius: 8px;
	&::placeholder {
		color: white;
	}
`;
const Input = styled(Field)<{ backgroundColor?: string }>`
	${styles}
`;
export const InputField = styled.input<{ backgroundColor?: string }>`
	${styles}
`;

export default function TextInput({ component = 'input', ...rest }: Props): ReactElement {
	return <Input {...rest} component={component} />;
}
