import styled from 'styled-components';


type TextProps = {
	fontSize?: string | number;
	unit?: 'em' | 'rem' | 'px';
	fontFamily?: string;
	color?: string;
};

const calculateProp = (value, unit, textOnly) => `${value}${textOnly ? '' : unit || 'px'};`;
const getComponentProps = props =>
	[
		{ prop: 'fontSize', css: 'font-size' },
		{ prop: 'fontFamily', css: 'font-family', textOnly: true },
		{ prop: 'color', css: 'color', textOnly: true }
	].reduce((str, { prop, css, textOnly }) => {
		const currentProp = props[prop];
		if (currentProp) {
			str += `${css}: ${calculateProp(currentProp, props.unit, textOnly)};`;
		}
		return str;
	}, '');

const Text = styled.p<TextProps>`
	${getComponentProps}
`;

export default Text;

