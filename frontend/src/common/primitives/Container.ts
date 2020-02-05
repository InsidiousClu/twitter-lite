import styled from 'styled-components';

type Props = {
	className?: string
}

export const Container = styled.div<Props>`
	max-width: 1400px;
	width: 100%;
	height: 100%;
`;
