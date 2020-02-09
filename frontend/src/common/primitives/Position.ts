import styled from 'styled-components';
import { animated } from 'react-spring';

type AbsoluteProps = {
	top?: number | string;
	bottom?: number | string;
	left?: number | string;
	right?: number | string;
	unit?: string;
	zIndex?: number
};

const getMeasurement = (pos, val, unit) => `${pos}:${val}${unit || 'px'};`;
const getPropsAndCalculateMeasurements = props => {
	const { top, bottom, left, right, unit } = props;
	return [
		{ pos: 'top', value: top },
		{ pos: 'bottom', value: bottom },
		{ pos: 'right', value: right },
		{ pos: 'left', value: left }
	].map(({ pos, value }) => (!isNaN(value) ? getMeasurement(pos, value, unit) : ''));
};

export const PositionAbsolute = styled(animated.div)<AbsoluteProps>`
	position: absolute;
	${getPropsAndCalculateMeasurements}
	${props => props.zIndex && `z-index: ${props.zIndex}`};
`;
