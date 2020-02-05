import styled from 'styled-components';

type TextProps = {
	fontSize?: string | number;
	unit?: 'em' | 'rem' | 'px';
	fontFamily?: string;
	color?: string;
};

const calculateProp = (value, unit) => `${value}${unit || 'px'};`;
const getComponentProps = props =>
	[
		{ prop: 'fontSize', css: 'font-size' },
		{ prop: 'fontFamily', css: 'font-family' },
		{ prop: 'color', css: 'color' }
	].reduce((str, { prop, css }) => {
		const currentProp = props[prop];
		if (currentProp) {
			str += `${css}: ${calculateProp(currentProp, props.unit)}`;
		}
		return str;
	}, '');

const Text = styled.p<TextProps>`
	${getComponentProps}
`;

export default Text;
