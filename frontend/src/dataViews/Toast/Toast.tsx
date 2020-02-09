import React, { ReactChildren, ReactElement, useContext, useEffect, useMemo, useRef } from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import styled, { css } from 'styled-components';
import { PositionAbsolute } from '../../common/primitives';
import { ToastContext } from './index';
import { ToastContextType, ToastType } from './ToastContext';

export type ToastProps = {
	position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
	children?: ReactChildren | string;
	fromYPos?: number;
	toYPos?: number;
	id?: string;
	type?: ToastType;
};

const config = {
	topRight: { top: 1, right: 1 },
	topLeft: { top: 1, left: 1 },
	bottomRight: { bottom: 1, right: 1 },
	bottomLeft: { bottom: 1, left: 1 }
};

const toastTypes = {
	error: css`
		background: red;
		color: white;
	`,
	success: css`
		background: forestgreen;
		color: white;
	`,
	common: css`
		background: white;
	`
};

const ToastContainer = styled(animated.div)<{ type: ToastType }>`
	${props => toastTypes[props.type]};
	border-radius: 8px;
	width: 350px;
	min-height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ANIMATION_DURATION = 350;
const X_AXIS_TRANSFORM = 400;

export default function Toast({
	position = 'topRight',
	children,
	fromYPos = -300,
	toYPos = 0,
	id = '',
	type = 'common'
}: ToastProps): ReactElement {
	const currentConfig = useMemo(() => config[position], [position]);
	const [{ x, y }, set] = useSpring(() => ({ y: fromYPos, x: 0 }));
	const { removeToastNode, duration } = useContext<ToastContextType>(ToastContext);

	const timeout = useRef<number>(0);
	const nodeRemoveTimeout = useRef<number>(0);

	const handleNodeRemove = () => {
		if (!nodeRemoveTimeout.current) {
			nodeRemoveTimeout.current = setTimeout(() => {
				removeToastNode(id);
			}, ANIMATION_DURATION);
		}
	};

	const resolveXAxisRemovePosition = () =>
		position === 'topRight' || position === 'bottomRight' ? X_AXIS_TRANSFORM : -X_AXIS_TRANSFORM;

	const handleNodeCleanup = () => {
		if (!timeout.current) {
			timeout.current = setTimeout(() => {
				set({ x: resolveXAxisRemovePosition() });
				handleNodeRemove();
			}, duration);
		}
	};

	useEffect(() => {
		handleNodeCleanup();
		return () => {
			clearTimeout(timeout.current);
			clearTimeout(nodeRemoveTimeout.current);
		};
	}, []);

	useEffect(() => {
		set({ y: toYPos });
	}, [toYPos]);

	return (
		<PositionAbsolute
			zIndex={9999}
			style={{
				transform: interpolate(
					[x, y],
					(xAxis: number, yAxis: number) => `translate3d(${xAxis}px, ${yAxis}px, 0)`
				)
			}}
			{...currentConfig}
			unit="rem"
		>
			<ToastContainer type={type}>{children}</ToastContainer>
		</PositionAbsolute>
	);
}
