import React from 'react';
import styled from 'styled-components';

type FlexProps = {
	flexDirection?: string;
	alignItems?: string;
	justifyContent?: string;
	alignSelf?: string;
	className?: string;
	flex?: string | number;
};

export const Flex: React.FunctionComponent<FlexProps> = styled.div<FlexProps>`
	display: flex;
	${props => props.flexDirection && `flex-direction: ${props.flexDirection}`};
	${props => props.alignItems && `align-items: ${props.alignItems}`};
	${props => props.justifyContent && `justify-content: ${props.justifyContent}`};
	${props => props.alignSelf && `align-self: ${props.alignSelf}`};
	${props => props.flex && `flex: ${props.flex}`};
`;
